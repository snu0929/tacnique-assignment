import React, { useState } from "react";
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
  FormErrorMessage,
  Spinner,
  Box,
  useTheme,
} from "@chakra-ui/react";
import axios from "axios";

const AddUserModal = ({ isOpen, onClose, onSuccess }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const theme = useTheme();

  const validateForm = () => {
    const newErrors = {};
    if (!firstName) newErrors.firstName = "First Name is required";
    if (!lastName) newErrors.lastName = "Last Name is required";
    if (!email) newErrors.email = "Email is required";
    if (!department) newErrors.department = "Department is required";
    return newErrors;
  };

  const handleSubmit = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await axios.post("https://jsonplaceholder.typicode.com/users", {
        name: `${firstName} ${lastName}`,
        email,
        company: { name: department },
      });
      toast({
        title: "User added.",
        description: "The new user has been added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onSuccess();
      onClose();
      // Clear form fields
      setFirstName("");
      setLastName("");
      setEmail("");
      setDepartment("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add user.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent bg={theme.colors.gray[50]} borderRadius="md">
        <ModalHeader color={theme.colors.blue[600]}>Add User</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4} isInvalid={!!errors.firstName}>
            <FormLabel>First Name</FormLabel>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              aria-label="First Name"
              borderColor={theme.colors.gray[300]}
              _placeholder={{ color: theme.colors.gray[500] }}
              _focus={{ borderColor: theme.colors.blue[500] }}
            />
            <FormErrorMessage>{errors.firstName}</FormErrorMessage>
          </FormControl>
          <FormControl mb={4} isInvalid={!!errors.lastName}>
            <FormLabel>Last Name</FormLabel>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              aria-label="Last Name"
              borderColor={theme.colors.gray[300]}
              _placeholder={{ color: theme.colors.gray[500] }}
              _focus={{ borderColor: theme.colors.blue[500] }}
            />
            <FormErrorMessage>{errors.lastName}</FormErrorMessage>
          </FormControl>
          <FormControl mb={4} isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              aria-label="Email"
              borderColor={theme.colors.gray[300]}
              _placeholder={{ color: theme.colors.gray[500] }}
              _focus={{ borderColor: theme.colors.blue[500] }}
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>
          <FormControl mb={4} isInvalid={!!errors.department}>
            <FormLabel>Department</FormLabel>
            <Input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Department"
              aria-label="Department"
              borderColor={theme.colors.gray[300]}
              _placeholder={{ color: theme.colors.gray[500] }}
              _focus={{ borderColor: theme.colors.blue[500] }}
            />
            <FormErrorMessage>{errors.department}</FormErrorMessage>
          </FormControl>
          {loading && (
            <Box textAlign="center" mt={4}>
              <Spinner size="xl" />
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleSubmit}
            isDisabled={loading}
            _hover={{ bg: theme.colors.blue[600] }}
            _active={{ bg: theme.colors.blue[700] }}
          >
            {loading ? "Adding..." : "Add"}
          </Button>
          <Button variant="ghost" onClick={onClose} isDisabled={loading}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddUserModal;
