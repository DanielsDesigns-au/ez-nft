import type { NextApiRequest, NextApiResponse } from "next";

import { Readable } from "stream";
import { pinata } from "@lib/pinata";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { method } = req;
    const jsonData = req?.body;
    const { path, dataUrl } = await JSON.parse(jsonData);
    if (!dataUrl || method !== "POST" || !path) {
        res.status(400).json({ error: "Bad Request" });
        return;
    } else {
        console.log(`File Url: ${!!dataUrl} \n\nFile Pathname: ${path}`);
    }

    // // For testing variables
    // res.status(200).json({ nft: "ez" });
    // return;

    const data = dataUrl.replace(/^data:image\/png;base64,/, "");
    const buff = Buffer.from(data, "base64");
    const stream = Readable.from(buff);

    // ¡¡ THE HACK !!
    (stream as any).path = path;

    // ---------- PINATA SDK -----------
    try {
        const response = await pinata.pinFileToIPFS(stream);

        console.log("\n \n -------- RESPONSE ------- \n", response);
        response?.IpfsHash
            ? res.status(200).send(response)
            : res.status(400).send(response);
        return;
    } catch (error) {
        res.status(504).json({ error: "Server failure" });
        return;
    }
}
