document.addEventListener('DOMContentLoaded', function () {

  // Mobile nav toggle
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var answer = btn.nextElementSibling;

      document.querySelectorAll('.faq-question').forEach(function (other) {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          other.nextElementSibling.style.maxHeight = null;
        }
      });

      btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      answer.style.maxHeight = expanded ? null : answer.scrollHeight + 'px';
    });
  });

  // Buyer type toggle (Individual / Business) — display only, pricing doesn't change
  var buyerTypeBtns = document.querySelectorAll('.buyer-type-btn');
  var bulkPricing = document.getElementById('bulkPricing');
  if (buyerTypeBtns.length && bulkPricing) {
    buyerTypeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buyerTypeBtns.forEach(function (other) {
          other.classList.remove('active');
          other.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        bulkPricing.hidden = btn.dataset.buyerType !== 'business';
      });
    });
  }

  // Enroll form (seat count only — Stripe checkout wires in later)
  var enrollForm = document.getElementById('enrollForm');
  var formSuccess = document.getElementById('formSuccess');
  var seatsInput = document.getElementById('seats');
  var formTotal = document.getElementById('formTotal');

  if (enrollForm && seatsInput && formTotal) {
    var pricePerSeat = parseFloat(enrollForm.dataset.pricePerSeat);
    var updateTotal = function () {
      var seats = Math.max(1, parseInt(seatsInput.value, 10) || 1);
      formTotal.textContent = 'Total: $' + (seats * pricePerSeat).toFixed(2);
    };
    seatsInput.addEventListener('input', updateTotal);
    updateTotal();
  }

  if (enrollForm && formSuccess) {
    enrollForm.addEventListener('submit', function (e) {
      e.preventDefault();
      enrollForm.hidden = true;
      formSuccess.hidden = false;
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

});
