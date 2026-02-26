import { Router } from 'express';
import { searchRoutes } from '../controllers/trip.controller';

const router = Router();

// POST /api/trips/search-routes
router.post('/search-routes', searchRoutes);

export default router;
