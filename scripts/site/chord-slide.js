$(".songs").each(function() {
    $(this).hide();
});

$(".chords-section-title").click(function () {
    var header = $(this);
    var songs = header.next();
    songs.slideToggle(400);
});
