$(".songs").each(function() {
    $(this).hide();
});

$(".chords-section-title").click(function () {
    $(this).next().slideToggle(400);
});
