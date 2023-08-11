import React, { ReactNode, useState, createContext } from "react";

// Define the structure of the modal context
export interface IModalContext {
  modalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

// Create a React context for the modal
export const ModalContext = createContext<any>({});

// Define props for the ConversationModalProvider component
interface ConversationModalProps {
  children: ReactNode;
}

// Create a provider component for the conversation modal context
const ConversationModalProvider = ({ children }: ConversationModalProps) => {
  // State to manage the modal open/close status
  const [modalOpen, setModalOpen] = useState(false);

  // Function to open the modal
  const openModal = () => setModalOpen(true);

  // Function to close the modal
  const closeModal = () => setModalOpen(false);

  // Value to be provided by the context
  const value: IModalContext = {
    modalOpen,
    openModal,
    closeModal,
  };

  // Provide the context value to children components
  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

export default ConversationModalProvider;
