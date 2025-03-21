import express from 'express'
import { addImageHotel, createHotel, deleteHotel, getAllHotels, getCityHotel, getHotel, getHotels, getPopularHotels, removeImageHotel, updateHotel } from '../controllers/hotel.controller.js';
import { verifyAdmin } from '../utils/AdminMiddleware.js';

const router = express.Router()

router.get("/view/:id", getHotel)
router.get("/popular-hotels?:page", getPopularHotels)
router.post("/create", verifyAdmin, createHotel)
router.put("/update/:id", verifyAdmin, updateHotel)
router.delete("/delete/:id", verifyAdmin, deleteHotel)
router.get("/city/:city", getCityHotel)
router.get("/all?:page", getHotels)
router.get("/all-hotels", getAllHotels)
router.put("/add-image/:id", verifyAdmin, addImageHotel)
router.put("/remove-image/:id", verifyAdmin, removeImageHotel)

export default router;