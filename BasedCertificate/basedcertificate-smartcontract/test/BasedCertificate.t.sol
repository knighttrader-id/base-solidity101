// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Test.sol";
import "../src/BasedCertificate.sol";

contract BasedCertificateTest is Test {
    BasedCertificate public basedCertificate;
    address public owner;
    address public issuer;
    address public recipient;
    address public otherAccount;

    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    function setUp() public {
        owner = address(this);
        issuer = makeAddr("issuer");
        recipient = makeAddr("recipient");
        otherAccount = makeAddr("otherAccount");

        basedCertificate = new BasedCertificate();

        // Grant roles to issuer
        basedCertificate.grantRole(ISSUER_ROLE, issuer);
        basedCertificate.grantRole(MANAGER_ROLE, issuer);
    }

    function testIssueCertificate() public {
        vm.startPrank(issuer);
        
        basedCertificate.issueCertificate(
            recipient,
            "John Doe",
            "Solidity Development",
            "Base Academy",
            "https://example.com/certificate/1"
        );
        
        vm.stopPrank();
        
        // Verify certificate was issued
        assertEq(basedCertificate.getCertificatesByOwner(recipient).length, 1);
    }

    function testRevokeCertificate() public {
        vm.startPrank(issuer);
        
        basedCertificate.issueCertificate(
            recipient,
            "John Doe",
            "Solidity Development",
            "Base Academy",
            "https://example.com/certificate/1"
        );
        
        uint256 tokenId = basedCertificate.getCertificatesByOwner(recipient)[0];
        basedCertificate.revokeCertificate(tokenId);
        
        vm.stopPrank();
        
        // Verify certificate was revoked
        (,,, , bool valid) = basedCertificate.certificates(tokenId);
        assertFalse(valid);
    }

    function testUpdateCertificate() public {
        vm.startPrank(issuer);
        
        basedCertificate.issueCertificate(
            recipient,
            "John Doe",
            "Solidity Development",
            "Base Academy",
            "https://example.com/certificate/1"
        );
        
        uint256 tokenId = basedCertificate.getCertificatesByOwner(recipient)[0];
        basedCertificate.updateCertificate(tokenId, "Advanced Solidity Development");
        
        vm.stopPrank();
        
        // Verify certificate was updated
        (, string memory course, , , ) = basedCertificate.certificates(tokenId);
        assertEq(course, "Advanced Solidity Development");
    }

    function testBurnCertificate() public {
        vm.startPrank(issuer);
        
        basedCertificate.issueCertificate(
            recipient,
            "John Doe",
            "Solidity Development",
            "Base Academy",
            "https://example.com/certificate/1"
        );
        
        uint256 tokenId = basedCertificate.getCertificatesByOwner(recipient)[0];
        basedCertificate.burnCertificate(tokenId);
        
        vm.stopPrank();
        
        // Verify certificate was burned
        assertEq(basedCertificate.getCertificatesByOwner(recipient).length, 0);
    }

    function testGrantRole() public {
        vm.startPrank(owner);
        
        assertFalse(basedCertificate.hasRole(ISSUER_ROLE, otherAccount));
        basedCertificate.grantRole(ISSUER_ROLE, otherAccount);
        assertTrue(basedCertificate.hasRole(ISSUER_ROLE, otherAccount));
        
        vm.stopPrank();
    }

    function testRevokeRole() public {
        vm.startPrank(owner);
        
        basedCertificate.grantRole(ISSUER_ROLE, otherAccount);
        assertTrue(basedCertificate.hasRole(ISSUER_ROLE, otherAccount));
        
        basedCertificate.revokeRole(ISSUER_ROLE, otherAccount);
        assertFalse(basedCertificate.hasRole(ISSUER_ROLE, otherAccount));
        
        vm.stopPrank();
    }

    function testPreventDuplicateCertificate() public {
        vm.startPrank(issuer);
        
        basedCertificate.issueCertificate(
            recipient,
            "John Doe",
            "Solidity Development",
            "Base Academy",
            "https://example.com/certificate/1"
        );
        
        // Try to issue the same certificate again
        vm.expectRevert("BasedCertificate: Certificate already exists");
        basedCertificate.issueCertificate(
            recipient,
            "John Doe",
            "Solidity Development",
            "Base Academy",
            "https://example.com/certificate/2"
        );
        
        vm.stopPrank();
    }

    function testNonTransferable() public {
        vm.startPrank(issuer);
        
        basedCertificate.issueCertificate(
            recipient,
            "John Doe",
            "Solidity Development",
            "Base Academy",
            "https://example.com/certificate/1"
        );
        
        uint256 tokenId = basedCertificate.getCertificatesByOwner(recipient)[0];
        vm.stopPrank();
        
        // Try to transfer the certificate
        vm.startPrank(recipient);
        vm.expectRevert("BasedCertificate: Certificates are non-transferable");
        basedCertificate.transferFrom(recipient, otherAccount, tokenId);
        
        vm.stopPrank();
    }

    function testOnlyIssuerCanIssue() public {
        vm.startPrank(recipient);
        
        vm.expectRevert(
            abi.encodeWithSignature(
                "AccessControlUnauthorizedAccount(address,bytes32)",
                recipient,
                ISSUER_ROLE
            )
        );
        basedCertificate.issueCertificate(
            recipient,
            "John Doe",
            "Solidity Development",
            "Base Academy",
            "https://example.com/certificate/1"
        );
        
        vm.stopPrank();
    }

    function testOnlyManagerCanRevoke() public {
        vm.startPrank(issuer);
        
        basedCertificate.issueCertificate(
            recipient,
            "John Doe",
            "Solidity Development",
            "Base Academy",
            "https://example.com/certificate/1"
        );
        
        uint256 tokenId = basedCertificate.getCertificatesByOwner(recipient)[0];
        vm.stopPrank();
        
        vm.startPrank(recipient);
        vm.expectRevert(
            abi.encodeWithSignature(
                "AccessControlUnauthorizedAccount(address,bytes32)",
                recipient,
                MANAGER_ROLE
            )
        );
        basedCertificate.revokeCertificate(tokenId);
        
        vm.stopPrank();
    }

    function testOnlyManagerCanUpdate() public {
        vm.startPrank(issuer);
        
        basedCertificate.issueCertificate(
            recipient,
            "John Doe",
            "Solidity Development",
            "Base Academy",
            "https://example.com/certificate/1"
        );
        
        uint256 tokenId = basedCertificate.getCertificatesByOwner(recipient)[0];
        vm.stopPrank();
        
        vm.startPrank(recipient);
        vm.expectRevert(
            abi.encodeWithSignature(
                "AccessControlUnauthorizedAccount(address,bytes32)",
                recipient,
                MANAGER_ROLE
            )
        );
        basedCertificate.updateCertificate(tokenId, "Advanced Solidity Development");
        
        vm.stopPrank();
    }

    function testOwnerOrManagerCanBurn() public {
        vm.startPrank(issuer);
        
        basedCertificate.issueCertificate(
            recipient,
            "John Doe",
            "Solidity Development",
            "Base Academy",
            "https://example.com/certificate/1"
        );
        
        uint256 tokenId = basedCertificate.getCertificatesByOwner(recipient)[0];
        vm.stopPrank();
        
        // Test that owner can burn their own certificate
        vm.startPrank(recipient);
        basedCertificate.burnCertificate(tokenId);
        vm.stopPrank();
        
        // Verify certificate was burned
        assertEq(basedCertificate.getCertificatesByOwner(recipient).length, 0);
    }
}
