import '../css/Loading.css';

function Loading(props) {
  return (
    <div className="modal fade" id={props.id} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
                <div className="modal-header border-0">
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
                <div className="modal-footer border-0">
                    <h1 className="modal-title mx-auto">{props.message}</h1>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Loading;