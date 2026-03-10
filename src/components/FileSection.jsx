import React, { useState } from 'react';
import api, { baseURL } from '../utils/api';
import { toast } from 'react-toastify';
import { FaUpload, FaDownload, FaTrash, FaFileAlt, FaFilePdf, FaFileWord, FaFileImage, FaFolderOpen, FaTimes, FaLink } from 'react-icons/fa';

const FileSection = ({ type, id, files, onFileChange, isAdmin }) => {
    const [uploading, setUploading] = useState(false);
    const [fileName, setFileName] = useState("");
    const [linkUrl, setLinkUrl] = useState("");
    const [showUpload, setShowUpload] = useState(false);
    const [activeTab, setActiveTab] = useState('file');

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', fileName || file.name);

        setUploading(true);
        try {
            await api.post(`/upload/${type}/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success("File uploaded successfully");
            setFileName("");
            setShowUpload(false);
            onFileChange();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to upload file");
        } finally {
            setUploading(false);
        }
    };

    const handleAddLink = async () => {
        if (!fileName || !linkUrl) {
            toast.error("Please provide both name and URL");
            return;
        }

        let finalUrl = linkUrl;
        if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
            finalUrl = 'https://' + finalUrl;
        }

        setUploading(true);
        try {
            await api.post(`/upload/link/${type}/${id}`, {
                name: fileName,
                url: finalUrl
            });
            toast.success("Link added successfully");
            setFileName("");
            setLinkUrl("");
            setShowUpload(false);
            onFileChange();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add link");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (fileId) => {
        if (!window.confirm("Are you sure you want to delete this?")) return;

        try {
            await api.delete(`/upload/${type}/${id}/${fileId}`);
            toast.success("Deleted successfully");
            onFileChange();
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    const getFileIcon = (url) => {
        if (url.startsWith('http') && !url.includes('/uploads/')) return <FaLink style={{ color: '#8b5cf6' }} />;
        const ext = url.split('.').pop().toLowerCase();
        if (['pdf'].includes(ext)) return <FaFilePdf style={{ color: '#e74c3c' }} />;
        if (['doc', 'docx'].includes(ext)) return <FaFileWord style={{ color: '#3498db' }} />;
        if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return <FaFileImage style={{ color: '#2ecc71' }} />;
        return <FaFileAlt style={{ color: '#7f8c8d' }} />;
    };

    return (
        <div className="file-section-premium" style={{
            marginTop: '20px',
            padding: '20px',
            borderRadius: '12px',
            background: '#ffffff',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e5e7eb'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#111827', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaFolderOpen style={{ color: '#f59e0b' }} /> Study Materials & Links
                </h4>
                {isAdmin && !showUpload && (
                    <button
                        onClick={() => setShowUpload(true)}
                        className="button"
                        style={{ padding: '6px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                        <FaUpload /> Add Material
                    </button>
                )}
            </div>

            {isAdmin && showUpload && (
                <div style={{
                    marginBottom: '20px',
                    padding: '15px',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px dashed #d1d5db',
                    position: 'relative'
                }}>
                    <button
                        onClick={() => setShowUpload(false)}
                        style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
                    >
                        <FaTimes />
                    </button>

                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                        <button
                            onClick={() => setActiveTab('file')}
                            style={{
                                background: 'none',
                                border: 'none',
                                borderBottom: activeTab === 'file' ? '2px solid #3b82f6' : '2px solid transparent',
                                color: activeTab === 'file' ? '#3b82f6' : '#6b7280',
                                padding: '5px 10px',
                                cursor: 'pointer',
                                fontWeight: activeTab === 'file' ? '600' : '400',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                        >
                            <FaUpload /> Upload File
                        </button>
                        <button
                            onClick={() => setActiveTab('link')}
                            style={{
                                background: 'none',
                                border: 'none',
                                borderBottom: activeTab === 'link' ? '2px solid #3b82f6' : '2px solid transparent',
                                color: activeTab === 'link' ? '#3b82f6' : '#6b7280',
                                padding: '5px 10px',
                                cursor: 'pointer',
                                fontWeight: activeTab === 'link' ? '600' : '400',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                        >
                            <FaLink /> Add Link
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                        <input
                            type="text"
                            placeholder={activeTab === 'file' ? "Display Name (e.g. Unit 1 Notes)" : "Link Name (e.g. Reference Video)"}
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                            className="search-input"
                            style={{ margin: 0, flex: '1', minWidth: '200px', padding: '10px' }}
                        />

                        {activeTab === 'file' ? (
                            <label className="button" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                cursor: uploading ? 'not-allowed' : 'pointer',
                                opacity: uploading ? 0.7 : 1,
                                margin: 0,
                                height: '42px'
                            }}>
                                <FaUpload /> {uploading ? "Processing..." : "Select & Upload"}
                                <input type="file" hidden onChange={handleUpload} disabled={uploading} />
                            </label>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    placeholder="URL (e.g. https://youtube.com/...)"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    className="search-input"
                                    style={{ margin: 0, flex: '1', minWidth: '200px', padding: '10px' }}
                                />
                                <button
                                    onClick={handleAddLink}
                                    disabled={uploading}
                                    className="button"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        cursor: uploading ? 'not-allowed' : 'pointer',
                                        opacity: uploading ? 0.7 : 1,
                                        margin: 0,
                                        height: '42px'
                                    }}
                                >
                                    <FaLink /> {uploading ? "Saving..." : "Add Link"}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            <div className="file-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '12px'
            }}>
                {files && files.length > 0 ? (
                    files.map((file) => {
                        const isExternalLink = file.url.startsWith('http') && !file.url.includes('/uploads/');
                        return (
                            <div key={file._id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px',
                                borderRadius: '8px',
                                background: '#f9fafb',
                                border: '1px solid #f3f4f6',
                                transition: 'all 0.2s ease',
                                cursor: 'default'
                            }} onMouseOver={(e) => e.currentTarget.style.borderColor = '#d1d5db'} onMouseOut={(e) => e.currentTarget.style.borderColor = '#f3f4f6'}>
                                <div style={{ fontSize: '24px', display: 'flex', alignItems: 'center' }}>
                                    {getFileIcon(file.url)}
                                </div>
                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                    <div style={{
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        color: '#374151',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {file.name}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                                        {new Date(file.createdAt || Date.now()).toLocaleDateString()}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <a
                                        href={isExternalLink ? file.url : `${baseURL.replace('/api/v1', '')}${file.url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={isExternalLink ? "Open Link" : "Download"}
                                        style={{
                                            color: '#3b82f6',
                                            background: '#eff6ff',
                                            padding: '8px',
                                            borderRadius: '6px',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        {isExternalLink ? <FaLink /> : <FaDownload />}
                                    </a>
                                    {isAdmin && (
                                        <button
                                            onClick={() => handleDelete(file._id)}
                                            title="Delete"
                                            style={{
                                                background: '#fef2f2',
                                                border: 'none',
                                                color: '#ef4444',
                                                cursor: 'pointer',
                                                padding: '8px',
                                                borderRadius: '6px',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <FaTrash />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px', color: '#9ca3af', fontSize: '14px', fontStyle: 'italic' }}>
                        No study materials or links added yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileSection;
