const deleteProduct = btn => {
  const productId = btn.dataset.prodid;
  const csrf = btn.dataset.csrf;
  const productEl = btn.closest('.l-product');

  fetch('/admin/product/' + productId, {
    method: 'DELETE',
    headers: {
      'csrf-token': csrf
    }
  })
    .then(result => {
      return result.json();
    })
    .then(data => {
      console.log(data);
      productEl.parentNode.removeChild(productEl);
    })
    .catch(err => {
      console.log(err);
    })
}
