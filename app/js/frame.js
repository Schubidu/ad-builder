(function($){$(function(){

    $('img').on('load', function(){
        $(this).next().toggleClass('hidden');
    });

    $('body').on('click', 'img', function(){
        var $this = $(this);
        $this.next().toggleClass('hidden');

        this.src = $this.data('src') + '?v=' + Math.random();

    });
})})(jQuery);