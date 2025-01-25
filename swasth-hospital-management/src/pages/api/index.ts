import { NextApiRequest, NextApiResponse } from 'next';

export const apiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  switch (method) {
    case 'GET':
      // Handle GET request
      break;
    case 'POST':
      // Handle POST request
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default apiHandler;