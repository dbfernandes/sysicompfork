function initializeCountdown(selector) {
  const countdownElements = $(selector);

  if (countdownElements.length === 0) return;

  countdownElements.each(function () {
    const countdownElement = $(this);
    const deadline = countdownElement.data('deadline');

    if (!deadline) {
      countdownElement.text('Data não definida');
      return;
    }

    const countdownInterval = setInterval(function () {
      const finalDate = new Date(deadline);
      const now = new Date().getTime();
      const distance = finalDate - now;

      if (distance < 0) {
        clearInterval(countdownInterval);
        countdownElement
          .removeClass('text-success text-warning')
          .addClass('text-danger')
          .text('Prazo Esgotado');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      let result = '';
      if (days > 0) result += days + 'd ';
      result += ('0' + hours).slice(-2) + 'h ';
      result += ('0' + minutes).slice(-2) + 'm ';
      result += ('0' + seconds).slice(-2) + 's';

      countdownElement.removeClass('text-success text-warning text-danger');

      if (days > 3) {
        countdownElement.addClass('text-success');
      } else if (days > 1) {
        countdownElement.addClass('text-warning');
      } else {
        // Último dia (<= 1) já é vermelho
        countdownElement.addClass('text-danger');
      }

      countdownElement.text(result.trim());
    }, 1000);
  });
}

// Inicializa todos os contadores na página quando o documento estiver pronto
$(document).ready(function () {
  initializeCountdown('.js-countdown');
});
