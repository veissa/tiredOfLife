import { Request, Response } from 'express';
import { AppDataSource } from '../index';
import { Producer } from '../models/Producer';
import { User } from '../models/User';

// Get producer profile(s)
export const getProducerProfile = async (req: Request, res: Response) => {
  try {
    const producerRepository = AppDataSource.getRepository(Producer);
    const userId = req.user?.userId;
    const { id } = req.params; // Get optional producer ID from params

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID not found.' });
    }

    let producers;
    if (id) {
      // If an ID is provided, fetch that specific producer profile
      const producer = await producerRepository.findOne({
        where: { id: id, user: { id: userId } },
        relations: ['user']
      });
      if (!producer) {
        console.log(`Producer profile not found for ID: ${id} and User ID: ${userId}`);
        return res.status(404).json({ message: 'Producer profile not found or not owned by user.' });
      }
      producers = [producer]; // Return as an array for consistency with existing frontend expectations
    } else {
      // If no ID, fetch all producer profiles for the user
      producers = await producerRepository.find({
        where: { user: { id: userId } },
        relations: ['user']
      });
    }

    if (!producers || producers.length === 0) {
      console.log(`No producer profiles found for User ID: ${userId}`);
      return res.status(404).json({ message: 'No producer profiles found for this user.' });
    }
    console.log("Returning producers:", producers);
    res.json(producers);
  } catch (error) {
    console.error('Error fetching producer profile:', error);
    res.status(500).json({ message: 'Error fetching producer profile' });
  }
};

// Create a new producer profile (shop)
export const createProducer = async (req: Request, res: Response) => {
  try {
    const producerRepository = AppDataSource.getRepository(Producer);
    const userRepository = AppDataSource.getRepository(User);
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID not found.' });
    }

    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const { shopName, description, address, certifications, pickupInfo } = req.body;

    // Basic validation
    if (!shopName || !description || !address) {
      return res.status(400).json({ message: 'Missing required fields: shopName, description, address.' });
    }

    const newProducer = new Producer();
    newProducer.shopName = shopName;
    newProducer.description = description;
    newProducer.address = address;
    newProducer.user = user;
    newProducer.userId = userId;

    // Handle certifications as an array
    if (certifications) {
      newProducer.certifications = Array.isArray(certifications) ? certifications : [certifications];
    } else {
      newProducer.certifications = [];
    }

    // Handle pickupInfo as an object
    if (pickupInfo) {
      try {
        newProducer.pickupInfo = JSON.parse(pickupInfo);
      } catch (e) {
        console.warn('Invalid pickupInfo JSON, saving as null.', e);
        newProducer.pickupInfo = {};
      }
    } else {
      newProducer.pickupInfo = {};
    }

    // Handle uploaded shop image
    if (req.file) {
      newProducer.images = [req.file.filename];
    } else {
      newProducer.images = [];
    }

    const savedProducer = await producerRepository.save(newProducer);
    res.status(201).json(savedProducer);

  } catch (error) {
    console.error('Error creating producer profile:', error);
    res.status(500).json({ message: 'Error creating producer profile' });
  }
};

// Update producer profile
export const updateProducerProfile = async (req: Request, res: Response) => {
  try {
    const producerRepository = AppDataSource.getRepository(Producer);
    const userId = req.user?.userId;
    const { id } = req.params; // Get producer ID from params

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID not found.' });
    }

    const producer = await producerRepository.findOne({
      where: { id: id, user: { id: userId } }
    });

    if (!producer) {
      return res.status(404).json({ message: 'Producer not found or not owned by user.' });
    }

    let { certifications, pickupInfo, ...rest } = req.body;

    // Ensure certifications is an array
    if (certifications) {
      certifications = Array.isArray(certifications) ? certifications : [certifications];
    } else {
      certifications = [];
    }

    // Ensure pickupInfo is an object (parse if stringified JSON)
    if (pickupInfo && typeof pickupInfo === 'string') {
      try {
        pickupInfo = JSON.parse(pickupInfo);
      } catch (e) {
        console.warn('Invalid pickupInfo JSON, ignoring.', e);
        pickupInfo = producer.pickupInfo; // Revert to existing if parsing fails
      }
    } else if (!pickupInfo) {
        pickupInfo = {}; // Default to empty object if not provided
    }

    // Handle uploaded image for shop
    if (req.file) {
      producer.images = [req.file.filename];
    }

    // Update producer fields
    Object.assign(producer, { ...rest, certifications, pickupInfo });
    
    console.log("Updating producer with data:", producer);

    await producerRepository.save(producer);
    res.json(producer);
  } catch (error) {
    console.error('Error updating producer profile:', error);
    res.status(500).json({ message: 'Error updating producer profile' });
  }
}; 