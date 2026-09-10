/*
    IMPORTANT:

    Real End-to-End Encryption should be performed
    on the client side.

    The backend should receive ciphertext.

    Example:

    Client A
       ↓
    Plain text
       ↓
    Client-side encryption
       ↓
    Ciphertext
       ↓
    Backend
       ↓
    MongoDB
       ↓
    Ciphertext
       ↓
    Client B
       ↓
    Client-side decryption
       ↓
    Plain text

    Do NOT store users' private encryption keys
    on the backend.
*/


export const prepareEncryptedMessage = ({
    encryptedContent,
    encryptionVersion = "v1"
}) => {

    return {

        encrypted_content:
            encryptedContent,

        encryption_version:
            encryptionVersion

    };

};