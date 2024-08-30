import React, { useCallback, useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Skeleton,
} from "@chakra-ui/react";
import axios from "axios";

const EditUserModal = ({ isOpen, onClose, userId, onSuccess }) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://jsonplaceholder.typicode.com/users/${userId}`
      );
      setUser({
        firstName: data.name.split(" ")[0],
        lastName: data.name.split(" ")[1],
        email: data.email,
        department: data.company.name,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user data. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  useEffect(() => {
    if (userId && isOpen) {
      fetchUser();
    }
    return () =>
      setUser({ firstName: "", lastName: "", email: "", department: "" });
  }, [userId, isOpen, fetchUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!user.firstName || !user.lastName || !user.email || !user.department) {
      toast({
        title: "Validation Error",
        description: "Please fill out all fields.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setSaving(true);
    try {
      await axios.put(`https://jsonplaceholder.typicode.com/users/${userId}`, {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        company: { name: user.department },
      });
      toast({
        title: "User Updated",
        description: "The user details have been updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit User</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <>
              <Skeleton height="40px" mb={4} />
              <Skeleton height="40px" mb={4} />
              <Skeleton height="40px" mb={4} />
              <Skeleton height="40px" mb={4} />
            </>
          ) : (
            <>
              <FormControl mb={4}>
                <FormLabel>First Name</FormLabel>
                <Input
                  name="firstName"
                  value={user.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  aria-label="First Name"
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Last Name</FormLabel>
                <Input
                  name="lastName"
                  value={user.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  aria-label="Last Name"
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={user.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  aria-label="Email"
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Department</FormLabel>
                <Input
                  name="department"
                  value={user.department}
                  onChange={handleInputChange}
                  placeholder="Department"
                  aria-label="Department"
                />
              </FormControl>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleSubmit}
            isLoading={saving}
            isDisabled={loading || saving}
          >
            Save
          </Button>
          <Button variant="ghost" onClick={onClose} isDisabled={saving}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditUserModal;
