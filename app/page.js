'use client';
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { Box, Stack, TextField, Typography, Button,Modal } from '@mui/material';
import { collection, getDoc, getDocs, query, setDoc, doc, deleteDoc } from "firebase/firestore";
import { firestore } from "@/firebase";

// Dynamic import for Modal to ensure client-side rendering
const DynamicModal = dynamic(() => import('@mui/material/Modal'), { ssr: false });

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  useEffect(() => {
    updateInventory();
  }, []);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    console.log(inventoryList);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const addItem = async () => {
    const docRef = doc(collection(firestore, 'inventory'), itemName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
    setItemName('');
    handleClose();
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              label="Item Name"
              fullWidth
            />
          </Stack>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              addItem(itemName);
              setItemName('');
              handleClose();
            }}
          >
            Add Item
          </Button>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
      <Box border="1px solid #333" width="800px">
        <Box
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h2" color="#333">
            Inventory Items
          </Typography>
        </Box>
        <Stack
          width="100%"
          height="300px"
          spacing={2}
          sx={{ overflowY: 'auto' }}
        >
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              padding={2}
              sx={{
                borderBottom: "1px solid #ccc",
              }}
            >
              <Typography variant="h5" color="#333" textAlign="center"> {name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
              <Typography variant="h5" color="#333" textAlign="center">
                {quantity}
              </Typography>
              <Button
                variant="contained"
                onClick={() => {
                  removeItem(name);
                }}
              >
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
