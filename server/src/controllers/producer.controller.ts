import { Request, Response } from 'express';
import { AppDataSource } from '../index';
import { Producer } from '../models/Producer';
import { User } from '../models/User';

export const getProducerProfile = async (req: Request, res: Response) => {
  try {
    const producerRepository = AppDataSource.getRepository(Producer);
    const userId = req.user?.userId; // Assuming userId is available from authentication middleware

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID not found.' });
    }

    const producer = await producerRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'], // Eager load user data if needed
    });

    if (!producer) {
      return res.status(404).json({ message: 'Producer profile not found.' });
    }

    res.json(producer);
  } catch (error) {
    console.error('Error fetching producer profile:', error);
    res.status(500).json({ message: 'Failed to fetch producer profile.' });
  }
};

export const updateProducerProfile = async (req: Request, res: Response) => {
  try {
    const producerRepository = AppDataSource.getRepository(Producer);
    const userId = req.user?.userId; // Assuming userId is available from authentication middleware

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID not found.' });
    }

    const producer = await producerRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!producer) {
      return res.status(404).json({ message: 'Producer profile not found.' });
    }

    const { certifications, pickupInfo, ...rest } = req.body;

    console.log('Received certifications from req.body:', certifications, 'Type:', typeof certifications, 'Is Array:', Array.isArray(certifications));
    console.log('Received file from req.file:', req.file); // Log the received file

    // Ensure certifications is an array
    producer.certifications = Array.isArray(certifications) ? certifications : [];

    // Ensure pickupInfo is an object
    producer.pickupInfo = typeof pickupInfo === 'object' && pickupInfo !== null ? pickupInfo : {};

    // Handle uploaded image for the shop
    if (req.file) {
      producer.images = [req.file.filename]; // Store the filename in the images array
    } else if (req.body.images === null || req.body.images === undefined) {
      // If no new file is uploaded and frontend explicitly sends null/undefined for images, clear them
      producer.images = [];
    } else if (Array.isArray(req.body.images)) {
      // If frontend sends an array of existing image names (e.g., from re-ordering or not changing image)
      producer.images = req.body.images;
    }

    // Assign other properties
    Object.assign(producer, rest);

    await producerRepository.save(producer);

    res.json(producer);
  } catch (error) {
    console.error('Error updating producer profile:', error);
    res.status(500).json({ message: 'Failed to update producer profile.' });
  }
}; 