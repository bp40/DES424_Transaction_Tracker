
import S3 from "aws-sdk/clients/s3";
import {randomUUID} from "crypto";
import {NextRequest, NextResponse} from "next/server";

const s3 = new S3({
    apiVersion: "2006-03-01",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    signatureVersion: "v4",
});

export async function GET(req: NextRequest, res: NextResponse) {

    const supabaseId = req.headers.get("x-supabase-id")

    if (!supabaseId) {
        return NextResponse.json({message: "Error fetching user"}, {status: 401})
    }

    const searchParams = req.nextUrl.searchParams
    const filetype = searchParams.get('fileType')

    const extension  = (filetype as string).split("/")[1]

    const Key = `${supabaseId}.${randomUUID()}.${extension}`

    const s3Params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: Key,
        Expires: 60,
        ContentType: `image/${extension}`,
    };

    const uploadURL = s3.getSignedUrl("putObject", s3Params);

    console.log(uploadURL)

    return NextResponse.json({
        key: Key,
        uploadURL,
    }, {status: 200})
}