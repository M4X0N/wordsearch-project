import '../css/Loading.css';

function Loading(props) {
  return (
    <div class="modal fade" id={props.id} data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
                <div class="modal-footer border-0">
                    <h1 class="modal-title mx-auto">{props.message}</h1>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Loading;