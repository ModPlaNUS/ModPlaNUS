import * as React from 'react';
import { Box } from '@mui/material';
import {useRef, useState, useEffect } from 'react';
import { db } from '../authentication/firebase-config';
import { auth } from '../authentication/firebase-config';
import { useCollectionData } from 'react-firebase-hooks/firestore';



export default function Chatroom() {
  
  return (
    <>
        <Box>
            <h3>CHATROOM</h3>

        </Box>
    </>
  );
}

