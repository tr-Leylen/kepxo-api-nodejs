import Conference from "../models/conference.model.js"
import JoinConference from "../models/joinconference.model.js"

export const createConference = async (req, res) => {
    try {
        const newConference = await Conference.create(req.body)
        res.status(201).json(newConference)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const updateConference = async (req, res) => {
    try {
        const id = req.params.id
        const conference = await Conference.findById(id)
        if (!conference) return res.status(404).json('Conference not found')
        const updated = await Conference.findByIdAndUpdate(id, req.body, { new: true })
        res.status(200).json(updated)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getConference = async (req, res) => {
    try {
        const id = req.params.id
        const conference = await Conference.findById(id)
        if (!conference) return res.status(404).json('Conference not found')
        res.status(200).json(conference)
    } catch (error) {
        res.status(500).json(error)
    }
}

export const deleteConference = async (req, res) => {
    try {
        const conference = await Conference.findById(req.params.id)
        if (!conference) return res.status(404).json('Conference not found')
        await JoinConference.deleteMany({ conferenceId: req.params.id })
        await Conference.findByIdAndDelete(req.params.id)
        res.status(200).json("Conference deleted")
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getAllConferences = async (req, res) => {
    try {
        const data = await Conference.find()
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
}