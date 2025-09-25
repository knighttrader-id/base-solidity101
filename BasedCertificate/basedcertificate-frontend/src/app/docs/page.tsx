"use client";

import { useState } from "react";

export default function Docs() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center py-12">
          <h1 className="text-4xl font-bold mb-4">Based Certificate Documentation</h1>
          <p className="text-xl text-gray-300">
            NFT-based certificate system for achievements, graduation, or training
          </p>
        </header>

        <main>
          <div className="flex border-b border-gray-700 mb-8">
            <button
              className={`py-2 px-4 font-semibold ${activeTab === "overview" ? "border-b-2 border-blue-500" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`py-2 px-4 font-semibold ${activeTab === "functions" ? "border-b-2 border-blue-500" : ""}`}
              onClick={() => setActiveTab("functions")}
            >
              Functions
            </button>
            <button
              className={`py-2 px-4 font-semibold ${activeTab === "events" ? "border-b-2 border-blue-500" : ""}`}
              onClick={() => setActiveTab("events")}
            >
              Events
            </button>
            <button
              className={`py-2 px-4 font-semibold ${activeTab === "roles" ? "border-b-2 border-blue-500" : ""}`}
              onClick={() => setActiveTab("roles")}
            >
              Roles
            </button>
          </div>

          {activeTab === "overview" && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="mb-4">
                Based Certificate is an NFT-based certificate system designed for issuing,
                managing, and verifying achievements, graduations, or training completions.
              </p>
              <p className="mb-4">
                The system implements several security features including:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Soulbound tokens (non-transferable)</li>
                <li>Reentrancy protection</li>
                <li>Role-based access control</li>
                <li>Duplicate certificate prevention</li>
              </ul>
              <p>
                Only authorized accounts with specific roles can perform certain operations
                like issuing, revoking, or updating certificates.
              </p>
            </div>
          )}

          {activeTab === "functions" && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Functions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">issueCertificate</h3>
                  <p className="mb-2">
                    Issues a new certificate to a recipient. Only callable by accounts with ISSUER_ROLE.
                  </p>
                  <p className="text-gray-400">
                    Parameters:
                    <ul className="list-disc pl-6">
                      <li>to: address - The recipient of the certificate</li>
                      <li>recipientName: string - The name of the certificate recipient</li>
                      <li>course: string - The course or achievement name</li>
                      <li>issuer: string - The issuer of the certificate</li>
                      <li>uri: string - The metadata URI for the certificate</li>
                    </ul>
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">revokeCertificate</h3>
                  <p className="mb-2">
                    Revokes a certificate, marking it as invalid. Only callable by accounts with REVOKER_ROLE.
                  </p>
                  <p className="text-gray-400">
                    Parameters:
                    <ul className="list-disc pl-6">
                      <li>tokenId: uint256 - The ID of the certificate to revoke</li>
                    </ul>
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">updateCertificate</h3>
                  <p className="mb-2">
                    Updates the course information of a certificate. Only callable by accounts with UPDATER_ROLE.
                  </p>
                  <p className="text-gray-400">
                    Parameters:
                    <ul className="list-disc pl-6">
                      <li>tokenId: uint256 - The ID of the certificate to update</li>
                      <li>newCourse: string - The new course name</li>
                    </ul>
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">burnCertificate</h3>
                  <p className="mb-2">
                    Burns a certificate, permanently removing it. Only callable by accounts with BURNER_ROLE.
                  </p>
                  <p className="text-gray-400">
                    Parameters:
                    <ul className="list-disc pl-6">
                      <li>tokenId: uint256 - The ID of the certificate to burn</li>
                    </ul>
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">getCertificatesByOwner</h3>
                  <p className="mb-2">
                    Returns an array of certificate IDs owned by a specific address.
                  </p>
                  <p className="text-gray-400">
                    Parameters:
                    <ul className="list-disc pl-6">
                      <li>owner: address - The address to query certificates for</li>
                    </ul>
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">grantRole</h3>
                  <p className="mb-2">
                    Grants a role to an account. Only callable by accounts with DEFAULT_ADMIN_ROLE.
                  </p>
                  <p className="text-gray-400">
                    Parameters:
                    <ul className="list-disc pl-6">
                      <li>role: bytes32 - The role to grant</li>
                      <li>account: address - The account to grant the role to</li>
                    </ul>
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">revokeRole</h3>
                  <p className="mb-2">
                    Revokes a role from an account. Only callable by accounts with DEFAULT_ADMIN_ROLE.
                  </p>
                  <p className="text-gray-400">
                    Parameters:
                    <ul className="list-disc pl-6">
                      <li>role: bytes32 - The role to revoke</li>
                      <li>account: address - The account to revoke the role from</li>
                    </ul>
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "events" && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Events</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">CertificateIssued</h3>
                  <p className="text-gray-400">
                    Emitted when a new certificate is issued.
                    <ul className="list-disc pl-6">
                      <li>tokenId: uint256 (indexed) - The ID of the issued certificate</li>
                      <li>recipient: address - The recipient of the certificate</li>
                      <li>course: string - The course or achievement name</li>
                      <li>issuer: string - The issuer of the certificate</li>
                    </ul>
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">CertificateRevoked</h3>
                  <p className="text-gray-400">
                    Emitted when a certificate is revoked.
                    <ul className="list-disc pl-6">
                      <li>tokenId: uint256 (indexed) - The ID of the revoked certificate</li>
                    </ul>
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">CertificateUpdated</h3>
                  <p className="text-gray-400">
                    Emitted when a certificate is updated.
                    <ul className="list-disc pl-6">
                      <li>tokenId: uint256 (indexed) - The ID of the updated certificate</li>
                      <li>newCourse: string - The new course name</li>
                    </ul>
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">RoleGranted</h3>
                  <p className="text-gray-400">
                    Emitted when a role is granted to an account.
                    <ul className="list-disc pl-6">
                      <li>role: bytes32 (indexed) - The role that was granted</li>
                      <li>account: address (indexed) - The account that received the role</li>
                      <li>sender: address (indexed) - The account that granted the role</li>
                    </ul>
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">RoleRevoked</h3>
                  <p className="text-gray-400">
                    Emitted when a role is revoked from an account.
                    <ul className="list-disc pl-6">
                      <li>role: bytes32 (indexed) - The role that was revoked</li>
                      <li>account: address (indexed) - The account that lost the role</li>
                      <li>sender: address (indexed) - The account that revoked the role</li>
                    </ul>
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "roles" && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Roles</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">DEFAULT_ADMIN_ROLE</h3>
                  <p className="mb-2">
                    The default admin role that can grant and revoke all other roles.
                  </p>
                  <p className="text-gray-400">
                    Role identifier: 0x0000000000000000000000000000000000000000000000000000000000000000
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">ISSUER_ROLE</h3>
                  <p className="mb-2">
                    Role that allows issuing new certificates.
                  </p>
                  <p className="text-gray-400">
                    Role identifier: keccak256("ISSUER_ROLE")
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">REVOKER_ROLE</h3>
                  <p className="mb-2">
                    Role that allows revoking existing certificates.
                  </p>
                  <p className="text-gray-400">
                    Role identifier: keccak256("REVOKER_ROLE")
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">UPDATER_ROLE</h3>
                  <p className="mb-2">
                    Role that allows updating certificate information.
                  </p>
                  <p className="text-gray-400">
                    Role identifier: keccak256("UPDATER_ROLE")
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">BURNER_ROLE</h3>
                  <p className="mb-2">
                    Role that allows burning certificates.
                  </p>
                  <p className="text-gray-400">
                    Role identifier: keccak256("BURNER_ROLE")
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>

        <footer className="text-center py-8 text-gray-500">
          <p>Based Certificate System</p>
        </footer>
      </div>
    </div>
  );
}