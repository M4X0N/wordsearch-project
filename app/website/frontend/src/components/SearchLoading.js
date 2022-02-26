import '../css/SearchLoading.css';

function SearchLoading(props) {
  return (
    <div class="modal fade" id="searchLoading" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
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
                    <h1 class="modal-title mx-auto">החיפוש מתבצע כעת...</h1>
                </div>
            </div>
        </div>
    </div>
  );
}

export default SearchLoading;