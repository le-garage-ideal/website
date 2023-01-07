'use client';
import React, { PropsWithChildren } from 'react';

import { motion } from 'framer-motion';
import toastStyles from './toast.module.scss';

export const Toast = ({ children, classNames = [] }: PropsWithChildren<{classNames: Array<string>}>) => (
  <motion.div
    className={['notification', toastStyles.toastContainer, ...classNames].join(' ')}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {children}
  </motion.div>
);
