import React from 'react'

const Modal = ({ open, title, children, onClose }) => {
  if (!open) return null

  const handleBackdrop = (e) => {
    if (e.target.classList.contains('modal-backdrop')) onClose?.()
  }

  return (
    <div className="modal-backdrop" onMouseDown={handleBackdrop}>
      <div
        className="modal-dlg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 id="modal-title" className="modal-title">{title}</h3>
          <button className="modal-close" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

export default Modal
