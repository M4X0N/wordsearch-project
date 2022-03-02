import React, {useState} from 'react';
import axios from 'axios';
import "bootstrap-icons/font/bootstrap-icons.css";

function FileUpload(props){
	const [selectedFile, setSelectedFile] = useState({});
	const [isFilePicked, setIsFilePicked] = useState(false);

	const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
	};
	
	const cancelChoice = (event) => {
		setSelectedFile(undefined);
		setIsFilePicked(false);
	}
	const handleSubmission = () => {
		const files = new FormData()
		files.append('file', selectedFile)
		if (props.filePurpose === "לקסיקון") {
   			axios.post("/files/lexicons", files)
		} else if (props.filePurpose === "טקסט") {
			axios.post("/files/texts", files)
		}
	};

	return(
   <div className="mt-3">
	   <p class="display-3 text-center">העלאת {props.filePurpose}</p>
	   <div>
			<input type="file" name="file" class="form-control" accept={props.acceptedTypes} onChange={changeHandler} />
			{isFilePicked ? (
				<div class="display-6 p-1" style={{ fontSize:20}}>
					<p><a>שם קובץ:</a> {selectedFile.name}</p>
					<p><a>סוג קובץ:</a> {selectedFile.type}</p>
					<p><a> גודל קובץ בבייטים:</a> {selectedFile.size}</p>
				</div>
			) : (
				<p>בחר קובץ עם אחת הסיומות הבאות: {props.acceptedTypes}</p>
			)}
		</div>
		<div>
			<button type="submit" class="btn btn-success w-25 m-1" onClick={handleSubmission}>העלה</button>
			<button class="btn btn-danger w-25 m-1" onClick={cancelChoice}>נקה חיפוש</button>
		</div>
	</div>
	)
}

export default FileUpload;