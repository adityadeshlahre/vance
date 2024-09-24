import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { User, UserSchema } from '@repo/types';
import { prisma } from '@repo/db';
import { scrapeYahooFinance } from './controllers/scraperController';
import { scrapeForexData } from './controllers/scraperForexDataController';
import './script/scraperCron'; 

const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello World!' });
});

app.get('/scrape', scrapeYahooFinance);
app.post('/scrape/forex-data', scrapeForexData);

app.post('/user', async (req: Request, res: Response) => {
  const parsed = UserSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors });
  }

  const { name, email, password }: User = parsed.data;

  try {
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: password,
      },
    });

    res.status(201).json({ user: newUser });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: 'An error occurred while creating the user.' });
  }
});

app.get('/users', async (req: Request, res: Response) => {
  try {
    const users: User[] = await prisma.user.findMany();

    res.status(201).json({ users: users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Fething user error' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
