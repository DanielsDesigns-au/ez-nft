import type { NextApiRequest, NextApiResponse } from "next";

import { pinata } from "@lib/pinata";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { body, method } = req;

    try {
        const jsonData = await JSON.parse(body);

        if (!jsonData || method !== "POST") {
            res.status(400).json({ error: "Bad Request" });
            return;
        } else {
            // console.log("Json Object", jsonData);
        }

        // ----- For testing variables -----
        // res.status(200).json({
        //     IpfsHash: "ezHashTest",
        //     PinSize: 420,
        //     Timestamp: "2022-02-10T00:25:24.146Z",
        // });
        // return;

        // ---------- PINATA SDK -----------
        const response = await pinata
            .pinJSONToIPFS(jsonData)
            .then((response) => response)
            .catch((error) => error);

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
