import {NextApiRequest, NextApiResponse} from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Rest of the API logic
  res.json({message: 'Hello Everyone!'})
}
