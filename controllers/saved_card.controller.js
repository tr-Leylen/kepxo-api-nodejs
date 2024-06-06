import SavedCard from '../models/saved_card.model.js';
import crypto from 'crypto'

export const createCard = async (req, res) => {
    try {
        const { cardNumber, date } = req.body;
        const card = await SavedCard.create({
            cardNumber,
            date,
            userId: req.userId
        })
        res.status(201).json(card)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const updateCard = async (req, res) => {
    try {
        const cardId = req.params.id;
        const card = await SavedCard.findById(cardId)
        if (!card) return res.status(404).json('Card not found');
        if (card.userId != req.userId) return res.status(401).json('You update only your cards');
        const updatedCard = await SavedCard.findByIdAndUpdate(cardId, {
            cardNumber: req.body.cardNumber,
            date: req.body.date
        }, { new: true })
        res.status(200).json(updatedCard)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const viewCard = async (req, res) => {
    try {
        const cardId = req.params.id;
        const card = await SavedCard.findById(cardId)
        if (!card) return res.status(404).json('Card not found');
        if (card.userId != req.userId) return res.status(401).json('You show only your cards');
        res.status(200).json(card)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getUserCards = async (req, res) => {
    try {
        const cards = await SavedCard.find({ userId: req.userId })
        res.status(200).json(cards)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const deleteCard = async (req, res) => {
    try {
        const cardId = req.params.id;
        await SavedCard.findByIdAndDelete(cardId)
        res.status(200).json('Card deleted')
    } catch (error) {
        res.status(500).json(error)
    }
}

const key = crypto.randomBytes(32)
const iv = crypto.randomBytes(16)
const algorithm = 'aes-256-cbc'

async function encryptCard(cardNumber) {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(cardNumber)
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {
        iv: iv.toString('hex'),
        number: encrypted.toString('hex')
    }
}

async function decryptCard(cardNumber) {
    let iv = Buffer.from(cardNumber.iv, 'hex');
    let encryptedText = Buffer.from(cardNumber.number, 'hex')
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv)
    let decrypted = decipher.update(encryptedText)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString()
}