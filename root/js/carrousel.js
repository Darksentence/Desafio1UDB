"use strict";

document.addEventListener('DOMContentLoaded', function () {
  const next = document.querySelector('.next');
  const prev = document.querySelector('.prev');
  const slide = document.querySelector('.slide');

  if (next) {
    next.addEventListener('click', function () {
      const items = document.querySelectorAll('.item');
      if (items.length && slide) slide.appendChild(items[0]);
    });
  }

  if (prev) {
    prev.addEventListener('click', function () {
      const items = document.querySelectorAll('.item');
      if (items.length && slide) slide.prepend(items[items.length - 1]);
    });
  }
});
