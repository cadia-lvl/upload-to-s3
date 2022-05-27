import { default as exp } from 'express';
import cors from 'cors';

// Create and export server
export const server = exp();

// Use cors
server.use(cors());

// Export wrapped express
export const express = exp;
