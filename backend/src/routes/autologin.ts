import { Request, Response, NextFunction } from 'express';
import { Router } from 'express';
import prisma from '../index';
import { ApiError } from '../types/errors';

const autologinRouter = Router();

/**
 * @swagger
 * /autologin:
 *   get:
 *     summary: Auto-login for MVP development
 *     description: Returns the first user ordered by UUID. MVP only - not for production use.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: User data for auto-login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   description: User ID
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: User email
 *                 name:
 *                   type: string
 *                   nullable: true
 *                   description: User display name
 *       404:
 *         description: No users found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
autologinRouter.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // TODO: MVP only - remove for production auth implementation
      const user = await prisma.user.findFirst({
        orderBy: { id: 'asc' },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      if (!user) {
        throw new ApiError(404, 'No users found');
      }

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
);

export default autologinRouter;
