(function($){$(function(){

    $('body').on('click', 'img', function(){
        var that = this;
        var $this = $(this);

        $this.next().toggleClass('hidden');
        $.get($this.data('src'), function(response){
            that.src = response.data;
            $this.next().toggleClass('hidden');

        })
    });
})})(jQuery);