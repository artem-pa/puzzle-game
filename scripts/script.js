$(document).ready(function () {
  ///////////////////////////
  // FUNCTIONS DECLARATION //
  ///////////////////////////

  //custom random function
  const rand = num => Math.round(Math.random() * num);

  // start game and randomize part of picture
  function newGame(x = 15, arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]) {
    if (x < 0) {
      $('.box .part').draggable({
        revert: 'invalid',
        revertDuration: 300,
        zIndex: 20,
        helper: 'clone',
        start: function () {
          $(this).css({opacity: '0'});
          if ($(this).parent().attr('id') !== $('#start').attr('id')) {
            $(this).parent().droppable('option', 'scope', 'default');
          }
          drag = this;
        },
        stop: function () {
          $(this).css({opacity: '1'});
        }
      })
      return;
    }
    if (x === 15) {
      timerEnd();
      hideHint();
      $('.btn-check').prop('disabled', true);
      $('#start').empty();
      $('#end .cell').empty();

      checkGame = setInterval(function () {
        if ($('.ui-draggable-dragging').length && second === -1) {
          timerStart();
        }
      }, 50)
    }
    let ind = rand(x);
    let index = arr[ind];
    let row = Math.floor(index / 4);
    $('#start').append(`<div class='part' id='${index}'></p>`);
    $(`#${index}`).css('background-position', `${(index - row * 4) * 33.3333}% ${row * 33.3333}%`);
    arr.splice(ind, 1);
    newGame(--x, arr);
  }

  //main timer start/end functions
  function timerStart() {
    second = 60;
    $('#end .cell').droppable('option', 'scope', 'default');
    $('.btn-check').prop('disabled', false);
    clearInterval(checkGame);
    timerID = setInterval(function () {
      $('.btn-start').prop('disabled', true);
      second--;
      if (second < 0) {
        $('.box .part').draggable( 'destroy' );
        check(timeOverMsg);
        clearInterval(timerID);
      }
      else if (second < 10)
        time = '00:0' + second;
      else
        time = '00:' + second;
      $('span.time').text(time);
    }, 1000)
  }
  function timerEnd() {
    second = -1;
    time = '01:00';
    clearInterval(timerID);
    $('.btn-start').prop('disabled', false);
    $('span.time').text(time);

  }

  //show/hide hint functions
  function showHint() {
    $(this).prop('disabled', true);
    $('.part')
      .each(function () {
        $(this).text(parseInt($(this).attr('id')) + 1)
      })
      .animate({ color: '#fff', }, 500)
      .css('text-shadow', '0 0 5px #000')
    $('.hint')
      .addClass('hint-active', 500)
      .off('click')
    hintTimer = setTimeout(hideHint, 10000)
  }
  function hideHint() {
    clearTimeout(hintTimer);
    $('.hint').prop('disabled', false);
    $('.part')
      .empty()
      .css('text-shadow', '0 0 5px #0000')
      .animate({ color: '#fff0', }, 500)

    $('.hint')
      .removeClass('hint-active', 500)
      .on('click', showHint)
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
  function check(text) {
    let parts = $('#end .part');
    let isValid = true;
    if (parts.length < 16) isValid = false;
    else
      for (let i = 0; i < 16; i++) {
        if (i != parts.eq(i).attr('id')) isValid = false;
      }
    timerEnd();
    showModal(isValid ? text.win : text.lose);
  }

  ///////////////
  // MAIN CODE //
  ///////////////

  let drag;
  let timerID;
  let checkGame;
  let hintTimer;
  let second = -1;
  let time = '01:00';
  const afterGameMsg = {
    win: 'Congradulations, you did it!',
    lose: 'Sorry, but you lost'
  };
  const timeOverMsg = {
    win: 'So close, but you won!',
    lose: 'Game over, time out'
  }

  newGame();

  $('#start').droppable({
    accept: function (element) {
      if (element.parent().attr('id') !== 'start')
        return true;
    },
    drop: function () {
      drag.remove();
      $(drag).css({ top: '0', left: '0' });
      this.append(drag);
      console.log(drag);
    },
  })

  $('#end .cell').droppable({
    drop: function () {
      $(this).droppable('option', 'scope', 'none');
      drag.remove();
      $(drag).css({ top: '0', left: '0' });
      this.append(drag);
    },
    classes: {
      "ui-droppable-hover": "ui-state-hover",
    },
    scope: 'default',
  })
  
  $('.part').disableSelection();

  $('.btn-start').on('click', timerStart);

  $('.btn-check').on('click', () => showModal(`You still have time, you sure? <span class="time">${time}</span>`, true));

  $('.btn-new').on('click', () => newGame());

  $('.hint').on('click', showHint);

  $('.modal-close').on('click', closeModal);

  $('.modal-check').on('click', () => check(afterGameMsg));

  $('.modal-end').on('click', endGame);
})
