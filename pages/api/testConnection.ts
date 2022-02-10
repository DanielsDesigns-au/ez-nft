import type { NextApiRequest, NextApiResponse } from 'next';

import { pinata } from '@lib/pinata';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const response = await pinata
      .testAuthentication()
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((error) => {
        console.log(`Error : ${error}`);
        return false;
      });

    res.status(200).json(response);
  } catch (error) {
    res.status(502).json({ authenticated: false, error: 'Server Error' });
  }
}
