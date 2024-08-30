import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Skeleton,
  Alert,
  AlertIcon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Stack,
  useToast,
  Spinner,
  IconButton,
} from "@chakra-ui/react";
import axios from "axios";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import AddUserModal from "./modals/AddUserModal";
import EditUserModal from "./modals/EditUserModal";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch users");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const paginatedUsers = users.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handleAddUserSuccess = () => {
    fetchUsers();
  };

  const handleEditUserSuccess = () => {
    fetchUsers();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      setConfirmDeleteUser(null); // Close the confirmation modal
    } catch (err) {
      setError("Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Box p={4}>
        <Skeleton height="40px" />
        <Skeleton height="40px" mt={4} />
        <Skeleton height="40px" mt={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={{ base: 2, md: 4 }} maxW="container.xl" mx="auto">
      <Button
        colorScheme="teal"
        mb={4}
        onClick={() => setIsAddUserModalOpen(true)}
      >
        Add User
      </Button>
      <Table variant="simple" size={{ base: "sm", md: "md" }}>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>First Name</Th>
            <Th>Last Name</Th>
            <Th>Email</Th>
            <Th>Department</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {paginatedUsers.map((user, index) => (
            <Tr
              key={user.id}
              bg={index % 2 === 0 ? "gray.100" : "white"}
              _hover={{ bg: "gray.50" }}
            >
              <Td>{user.id}</Td>
              <Td>{user.name.split(" ")[0]}</Td>
              <Td>{user.name.split(" ")[1]}</Td>
              <Td>{user.email}</Td>
              <Td>{user.company.name}</Td>
              <Td>
                <IconButton
                  aria-label="Edit User"
                  icon={<EditIcon />}
                  colorScheme="blue"
                  mr={2}
                  onClick={() => {
                    setSelectedUserId(user.id);
                    setIsEditUserModalOpen(true);
                  }}
                />
                <IconButton
                  aria-label="Delete User"
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  onClick={() => setConfirmDeleteUser(user.id)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Box mt={4} display="flex" justifyContent="center">
        <Stack direction={{ base: "column", md: "row" }} spacing={4}>
          <Button
            onClick={() => handlePageChange(page - 1)}
            isDisabled={page === 1}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              colorScheme={index + 1 === page ? "blue" : "gray"}
            >
              {index + 1}
            </Button>
          ))}
          <Button
            onClick={() => handlePageChange(page + 1)}
            isDisabled={page === totalPages}
          >
            Next
          </Button>
        </Stack>
      </Box>
      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSuccess={handleAddUserSuccess}
      />

      {/* Edit User Modal */}
      {selectedUserId && (
        <EditUserModal
          isOpen={isEditUserModalOpen}
          onClose={() => setIsEditUserModalOpen(false)}
          userId={selectedUserId}
          onSuccess={handleEditUserSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteUser && (
        <Modal
          isOpen={!!confirmDeleteUser}
          onClose={() => setConfirmDeleteUser(null)}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirm Deletion</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>Are you sure you want to delete this user?</Text>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => handleDelete(confirmDeleteUser)}
              >
                {deleting ? <Spinner size="sm" /> : "Confirm"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setConfirmDeleteUser(null)}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default UserList;
