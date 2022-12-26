import React, { useState, useContext } from 'react';
import axios from 'axios';
import LanguageContext from "../contexts/LanguageContext"

function FileUpload(props){
	const [selectedFile, setSelectedFile] = useState({});
	const [isFilePicked, setIsFilePicked] = useState(false);

	const [wasValidated, setWasValidated] = useState(false);
	const data = useContext(LanguageContext).data.file_upload

	const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
	};
	
	const cancelChoice = (event) => {
		event.preventDefault();

		// file inputs can't be controlled in react for some reason so this needs to be done
		document.getElementById("fileInput").value = null;

		setSelectedFile(undefined);
		setIsFilePicked(false);
	}

	const handleSubmission = (event) => {
		event.preventDefault();

		if (!isFilePicked || !props.acceptedTypes.includes(selectedFile.name.split('.')[1])) {
			setWasValidated(true);
			return;
		}

		setWasValidated(false);

		const files = new FormData()
		files.append('file', selectedFile)

		if (props.filePurpose === "לקסיקון" || props.filePurpose === "lexicon") {
   			axios.post("/files/lexicons", files)
		} else if (props.filePurpose === "טקסט" || props.filePurpose === "text") {
			axios.post("/files/texts", files)
		}
	}

	return(
	<form className={`mt-3 ${wasValidated ? 'was-validated' : ''}`} noValidate>
		<p className="display-3 text-center">{data.upload_title} {props.filePurpose}</p>
		<div className="d-inline">
			<input type="file" name="file" id="fileInput" className="form-control" accept={props.acceptedTypes} onChange={changeHandler} required/>
			<div className="invalid-feedback">{data.invalid_feedback}</div>
			{ isFilePicked ? (
				<div className="display-6 p-1 d-inline" style={{ fontSize:20 }}>
					<p>{data.file_name} {selectedFile.name}</p>
					<p>{data.file_type} {selectedFile.type}</p>
					<p>{data.file_size} {selectedFile.size}</p>
				</div>
			) : (
				<p className='d-flex'>{data.choose_file}<p className="ms-1" dir="ltr">{props.acceptedTypes}</p></p>
			)}
		</div>
		<div>
			<button type="submit" className="btn btn-success w-25 m-1" onClick={handleSubmission}>{data.upload}</button>
			<button type="reset" className="btn btn-danger w-25 m-1" onClick={cancelChoice}>{data.clear_search}</button>
		</div>
	</form>
	)
}

export default FileUpload;