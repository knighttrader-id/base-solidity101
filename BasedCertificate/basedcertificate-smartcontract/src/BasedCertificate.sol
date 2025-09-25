// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC721Burnable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title BasedCertificate
 * @dev NFT-based certificate system for achievements, graduation, or training
 * Features:
 * - Soulbound (non-transferable)
 * - Metadata for certificate details
 * - Role-based access control for issuers and managers
 */
contract BasedCertificate is ERC721, ERC721URIStorage, ERC721Burnable, AccessControl, ReentrancyGuard {
    uint256 private _nextTokenId;

    // --- Roles ---
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    struct CertificateData {
        string recipientName;
        string course;
        string issuer;
        uint256 issuedDate;
        bool valid;
    }

    // --- Mappings ---
    mapping(uint256 => CertificateData) public certificates;
    mapping(address => uint256[]) public ownerCertificates; // Track all certs per owner
    mapping(bytes32 => bool) public certHashUsed; // Prevent duplicate certificate by hash

    // --- Events ---
    event CertificateIssued(
        uint256 indexed tokenId,
        address indexed recipient,
        string course,
        string issuer
    );
    event CertificateRevoked(uint256 indexed tokenId);
    event CertificateUpdated(uint256 indexed tokenId, string newCourse);
    event CertificateBurned(uint256 indexed tokenId, address indexed owner);

    constructor() ERC721("Based Certificate", "BCERT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ISSUER_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
    }

    /**
      * @dev Issue a new certificate
      * Use case: Awarding completion or graduation. Requires ISSUER_ROLE.
      */
    function issueCertificate(
        address to,
        string memory recipientName,
        string memory course,
        string memory issuer,
        string memory uri
    ) public onlyRole(ISSUER_ROLE) nonReentrant {
        require(to != address(0), "BasedCertificate: Recipient cannot be zero address");
        require(bytes(recipientName).length > 0, "BasedCertificate: Recipient name cannot be empty");
        require(bytes(course).length > 0, "BasedCertificate: Course name cannot be empty");
        require(bytes(issuer).length > 0, "BasedCertificate: Issuer name cannot be empty");
        require(bytes(uri).length > 0, "BasedCertificate: URI cannot be empty");

        // Create certificate hash to prevent duplicates
        bytes32 certHash = keccak256(abi.encode(recipientName, course, issuer));

        // Check for duplicate certificate
        require(!certHashUsed[certHash], "BasedCertificate: Certificate already exists");

        // Get next token ID
        uint256 tokenId = _nextTokenId++;

        // Mint new NFT
        _mint(to, tokenId);

        // Set token URI (certificate metadata file)
        _setTokenURI(tokenId, uri);

        // Save certificate data
        certificates[tokenId] = CertificateData({
            recipientName: recipientName,
            course: course,
            issuer: issuer,
            issuedDate: block.timestamp,
            valid: true
        });

        // Update mappings
        ownerCertificates[to].push(tokenId);
        certHashUsed[certHash] = true;

        // Emit event
        emit CertificateIssued(tokenId, to, course, issuer);
    }

    /**
      * @dev Revoke a certificate (e.g. if mistake or fraud). Requires MANAGER_ROLE.
      */
    function revokeCertificate(uint256 tokenId) public onlyRole(MANAGER_ROLE) {
        // Check token exists
        require(_ownerOf(tokenId) != address(0), "BasedCertificate: Token does not exist");

        // Mark certificate invalid
        certificates[tokenId].valid = false;

        // Emit event
        emit CertificateRevoked(tokenId);
    }

    /**
      * @dev Update certificate data (optional, for corrections). Requires MANAGER_ROLE.
      */
    function updateCertificate(uint256 tokenId, string memory newCourse) public onlyRole(MANAGER_ROLE) {
        // Check token exists
        require(_ownerOf(tokenId) != address(0), "BasedCertificate: Token does not exist");

        // Update course field
        certificates[tokenId].course = newCourse;

        // Emit event
        emit CertificateUpdated(tokenId, newCourse);
    }

    /**
      * @dev Get all certificates owned by an address
      */
    function getCertificatesByOwner(address owner)
        public
        view
        returns (uint256[] memory)
    {
        return ownerCertificates[owner];
    }

    /**
     * @dev Burn a certificate (soulbound cleanup). Can be called by the certificate holder or an account with MANAGER_ROLE.
     */
    function burnCertificate(uint256 tokenId) public nonReentrant {
        address tokenOwner = _ownerOf(tokenId);
        require(tokenOwner != address(0), "BasedCertificate: token does not exist");
        require(msg.sender == tokenOwner || hasRole(MANAGER_ROLE, msg.sender), "BasedCertificate: Caller is not owner or manager");

        // --- Clean up mappings before burning (Checks-Effects-Interactions) ---
        CertificateData memory certData = certificates[tokenId];

        // Remove from ownerCertificates array
        uint256[] storage ownerCerts = ownerCertificates[tokenOwner];
        bool found = false;
        for (uint256 i = 0; i < ownerCerts.length; i++) {
            if (ownerCerts[i] == tokenId) {
                ownerCerts[i] = ownerCerts[ownerCerts.length - 1];
                ownerCerts.pop();
                found = true;
                break;
            }
        }
        require(found, "BasedCertificate: TokenId not in owner's list");

        // Clear certificate hash mapping
        bytes32 certHash = keccak256(abi.encode(certData.recipientName, certData.course, certData.issuer));
        delete certHashUsed[certHash];

        // Delete certificate data
        delete certificates[tokenId];

        // --- Burn the NFT ---
        _burn(tokenId);
        emit CertificateBurned(tokenId, tokenOwner);
    }


    /**
      * @dev Override transfer functions to make non-transferable (soulbound)
      */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns(address){
        // Only allow minting (from == address(0)) and burning (to == address(0))
        require(to == address(0) || auth == address(0), "BasedCertificate: Certificates are non-transferable");

        return super._update(to, tokenId, auth);
    }

    // --- Overrides for multiple inheritance ---

    /**
     * @dev Override to resolve inheritance conflict between ERC721 and ERC721URIStorage.
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
