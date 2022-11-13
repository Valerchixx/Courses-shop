/* eslint-disable no-undef */
const toCurrency = price => new Intl.NumberFormat('ru-Ru', {
	currency: 'rub',
	style: 'currency',

}).format(price);

const toDate = date => new Intl.DateTimeFormat('ru-Ru', {
	day: '2-digit',
	month: 'long',
	year: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit',
}).format(new Date(date));

document.querySelectorAll('.price').forEach(item => {
	item.textContent = toCurrency(item.textContent);
});

document.querySelectorAll('.date').forEach(item => {
	item.textContent = toDate(item.textContent);
});

const $cart = document.querySelector('#cart');
if ($cart) {
	$cart.addEventListener('click', event => {
		if (event.target.classList.contains('js-remove')) {
			const {id} = event.target.dataset;

			fetch(`/cart/remove/${id}`, {
				method: 'delete',
			}).then(res => res.json())
				.then(cart => {
					// eslint-disable-next-line space-before-blocks
					if (cart.courses.length){
						const html = cart.courses.map(c => `
                        <tr>
                        <td>${c.title}</td>
                        <td>${c.count}</td>
                        <td> <button class="btn btn-small js-remove" data-id="${c.id}">Delete</button></td>
                    </tr>
                        `).join('');
						$cart.querySelector('tbody').innerHTML = html;
						$cart.querySelector('.price').textContent = toCurrency(cart.price);
					} else {
						$cart.innerHTML = '<p>The cart is empty</p>';
					}
				});
		}
	});
}
