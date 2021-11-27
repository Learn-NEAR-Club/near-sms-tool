$(document).ready(function ($) {
  const widthBody = $("body").width();

  $(".btn-connect").click(function (e) {
    e.preventDefault();

    // Button connect
    $(this).addClass("is-hidden");
    $(".mail-left__info").removeClass("is-hidden");

    // Mail list
    $(".mail-content__list-none").addClass("is-hidden");
    $(".mail-content__list").removeClass("is-hidden");
  });

  $(".mail-right__item").each(function (index, element) {
    // element == this
    let titleMail = $(this).find(".title");
    $(titleMail).click(function (e) {
      e.preventDefault();
      $(this).parent().find(".description").toggleClass("is-hidden");
    });
  });

  $(".mail-content__item").each(function (index, element) {
    $(this).click(function (e) {
      e.preventDefault();
      if (widthBody < 769) {
        $(".mail-right").show();
        $(".mail-content__component").hide();
      }

      $(".mail-right__no-selected").addClass("is-hidden");
      $(".mail-right__selected").removeClass("is-hidden");
    });
  });

  $(".reply").click(function (e) {
    e.preventDefault();
    $(".mail-right__sent").removeClass("is-hidden");
  });

  $(".forward").click(function (e) {
    e.preventDefault();
    $(".mail-right__sent").removeClass("is-hidden");
  });

  $(".btn-mail__sent").click(function (e) {
    e.preventDefault();
    $(".modal-sent").removeClass("is-hidden");
  });

  $(".btn-close").click(function (e) {
    e.preventDefault();
    $(".modal-sent").addClass("is-hidden");
    $(".modal-sent").removeClass("modal-minimize");
    $(".modal-sent").removeClass("modal-expand");
  });

  $(".btn-expand").click(function (e) {
    e.preventDefault();
    $(".modal-sent").toggleClass("modal-expand");
    $(".modal-sent").removeClass("modal-minimize");
  });

  $(".btn-minimize").click(function (e) {
    e.preventDefault();
    $(".modal-sent").toggleClass("modal-minimize");
  });

  $(".input__switch-theme").change(function (e) {
    // e.preventDefault();
    if ($(this).is(":checked")) {
      $("html").attr("data-theme", "light");
    } else {
      $("html").attr("data-theme", "dark");
    }
  });

  $(".btn-toggle-menu").click(function (e) {
    e.preventDefault();
    $(".mail-left").toggleClass("active");
    $(".modal-sent").addClass("is-hidden");
  });
});
