$(document).ready(function () {
  ///////////////////////////
  // FUNCTIONS DECLARATION //
  ///////////////////////////

  //custom random function
  const rand = num => Math.round(Math.random() * num);

  // start game and randomize part of picture
  function newGame(x = 15, arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]) {
    if (x < 0) {
      return;
    }
    if (x === 15) {
      timerEnd();
      hideHint();
      $('.btn-check').prop('disabled', true);
      $('.box').empty();

      checkGame = setInterval(function () {
        if ($('.ui-sortable-placeholder').length && second === -1) {
          timerStart();
        }
      }, 50)
    }
    let ind = rand(x);
    let index = arr[ind];
    let row = Math.floor(index / 4);
    // $('#start').append(`<div class='part' id='${index}'>${index}</p>`);
    $('#start').append(`<div class='part' id='${index}'></p>`);
    $(`#${index}`).css('background-position', `${(index - row * 4) * 33.3333}% ${row * 33.3333}%`);
    arr.splice(ind, 1);
    newGame(--x, arr);
  }

  //main timer start/end functions
  function timerStart() {
    second = 60;
    $('.btn-check').prop('disabled', false);
    clearInterval(checkGame);
    timerID = setInterval(function () {
      $('.btn-start').prop('disabled', true);
      second--;
      if (second < 0) {
        showModal(`It's a pity, but you lost`);
        clearInterval(timerID);
      }
      else if (second < 10)
        $('span').html('00:0' + second)
      else
        $('span').html('00:' + second)
    }, 1000)
  }
  function timerEnd() {
    second = -1;
    clearInterval(timerID);
    $('.btn-start').prop('disabled', false);
    $('span').html('01:00');
  }

  //show/hide hint functions
  function showHint() {
    $(this).prop('disabled', true);

    $('.part')
      .each(function () {
        $(this).text($(this).attr('id'))
      })
      .animate({ color: '#fff', }, 500)
      .css('text-shadow', '0 0 5px #000')
    $('.hint').addClass('hint-active', 500)
    $('.hint').off('click')
    hintTimer = setTimeout(hideHint, 10000)
  }
  function hideHint() {
    clearTimeout(hintTimer);
    $('.hint').prop('disabled', false);
    $('.part')
      .empty()
      .css('text-shadow', '0 0 5px #0000')
      .animate({ color: '#fff0', }, 500)
    $('.hint').removeClass('hint-active', 500)
    $('.hint').on('click', showHint)
  }

  //modal window functions
  function showModal(text, showGreen = false) {
    $('.modal-text').html(text);
    if (showGreen) {
      $('.modal-check').show();
      $('.modal-close').show();
      $('.modal-end').hide();
    }
    else {
      $('.modal-check').hide();
      $('.modal-close').hide();
      $('.modal-end').show();
    }
    $('.modal').css('zIndex', 1).animate({ opacity: 1 });
    $('.modal-container').animate({ top: '50' }, 500)
  }
  function closeModal() {
    $('.modal-container').animate({ top: '10' }, 500);
    $('.modal').animate({ opacity: 0 }, () => $('.modal').css('zIndex', -1));
  }
  function endGame() {
    timerEnd();
    newGame();
    closeModal();
  }

  //checking player's solution
  function check() {
    let parts = $('#end .part');
    let isValid = true;
    if (parts.length < 16) isValid = false;
    else
      for (let i = 0; i < 16; i++) {
        if (i != parts.eq(i).attr('id')) isValid = false;
      }
    timerEnd();
    showModal(isValid ? (`Woohoo, well done, you did it!`) : (`It's a pity, but you lost`));
  }

  ///////////////
  // MAIN CODE //
  ///////////////

  let timerID;
  let checkGame;
  let hintTimer;
  let second = -1;

  newGame();

  $('.box').sortable({
    connectWith: '#start, #end',
  })
  $('.part').disableSelection();

  $('.btn-start').on('click', timerStart);

  $('.btn-check').on('click', () => showModal('You still have time, you sure? <span>00:00</span>', true));

  $('.btn-new').on('click', () => newGame());

  $('.hint').on('click', showHint);

  $('.modal-close').on('click', closeModal);

  $('.modal-check').on('click', check);

  $('.modal-end').on('click', endGame);
})