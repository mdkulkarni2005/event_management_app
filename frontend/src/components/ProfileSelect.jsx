import React, { useEffect, useMemo, useRef, useState } from 'react'

const ProfileSelect = ({
	id,
	profiles = [],
	multiple = false,
	selectedIds = [], // for multiple
	selectedId = '', // for single
	onChange,
	placeholder = multiple ? 'Select profiles...' : 'Select profile...',
	searchPlaceholder = multiple ? 'Search profiles...' : 'Search current profile...',
	onCreateProfile, // optional: inline create inside dropdown; should return new id
}) => {
	const [open, setOpen] = useState(false)
	const [query, setQuery] = useState('')
		const [draftName, setDraftName] = useState('')
		const [showAddRow, setShowAddRow] = useState(false)
		const addInputRef = useRef(null)
	const containerRef = useRef(null)

	useEffect(() => {
		const onDocClick = (e) => {
			if (!containerRef.current) return
			if (!containerRef.current.contains(e.target)) setOpen(false)
		}
		document.addEventListener('mousedown', onDocClick)
		return () => document.removeEventListener('mousedown', onDocClick)
	}, [])

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase()
		if (!q) return profiles
		return profiles.filter((p) => p.name.toLowerCase().includes(q))
	}, [profiles, query])

	const isSelected = (pid) => (multiple ? selectedIds.includes(pid) : selectedId === pid)

	const toggle = (pid) => {
		if (multiple) {
			const next = isSelected(pid) ? selectedIds.filter((x) => x !== pid) : [...selectedIds, pid]
			onChange?.(next)
		} else {
			onChange?.(pid)
			setOpen(false)
		}
	}

	const summary = () => {
		if (multiple) {
			if (!selectedIds || selectedIds.length === 0) return placeholder
			return `${selectedIds.length} profile${selectedIds.length > 1 ? 's' : ''} selected`
		} else {
			const p = profiles.find((x) => x.id === selectedId)
			return p ? p.name : placeholder
		}
	}

		const tryInlineAdd = async () => {
		const name = (draftName || query).trim()
		if (!name) return
		if (profiles.some((p) => p.name.toLowerCase() === name.toLowerCase())) return
		if (onCreateProfile) {
			const idNew = await onCreateProfile(name)
			if (idNew) {
				if (multiple) {
					const next = Array.from(new Set([...(selectedIds || []), idNew]))
					onChange?.(next)
				} else {
					onChange?.(idNew)
					setOpen(false)
				}
			}
			setDraftName('')
			setQuery('')
				setShowAddRow(false)
		}
	}
		const canSuggestFromQuery = (query.trim().length > 0) && !profiles.some((p) => p.name.toLowerCase() === query.trim().toLowerCase())
		const showInlineAdd = !!onCreateProfile && (showAddRow || canSuggestFromQuery)

	return (
		<div className="psel" ref={containerRef}>
			<button
				type="button"
				id={id}
				className="psel-trigger"
				aria-haspopup="listbox"
				aria-expanded={open}
				onClick={() => setOpen((o) => !o)}
			>
				<span className="psel-label">{summary()}</span>
				<span className="psel-caret">▾</span>
			</button>
			{open && (
				<div className="psel-popover" role="listbox">
					<input
						type="text"
						className="psel-search"
						placeholder={searchPlaceholder}
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						autoFocus
					/>
								<ul className="psel-list">
						{filtered.length === 0 ? (
							<li className="psel-empty">No profiles</li>
						) : (
							filtered.map((p) => (
								<li
									key={p.id}
									className={isSelected(p.id) ? 'psel-option selected' : 'psel-option'}
									onClick={() => toggle(p.id)}
									role="option"
									aria-selected={isSelected(p.id)}
									title={p.name}
								>
									{p.name}
								</li>
							))
						)}
									{onCreateProfile && (
										<li
											className="psel-add"
											onClick={() => {
												setShowAddRow(true)
												setTimeout(() => addInputRef.current?.focus(), 0)
											}}
										>
											+ Add Profile
										</li>
									)}
						{showInlineAdd && (
							<li className="psel-inline-add" onClick={(e) => e.stopPropagation()}>
								<input
									type="text"
									className="psel-inline-input"
									placeholder="New profile name"
												value={(showAddRow ? draftName : (draftName || query))}
												onChange={(e) => setDraftName(e.target.value)}
												ref={addInputRef}
								/>
								<button className="psel-inline-btn" onClick={tryInlineAdd}>Add</button>
							</li>
						)}
					</ul>
				</div>
			)}
		</div>
	)
}

export default ProfileSelect

