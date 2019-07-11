## 存放一些多余的代码

```
  #myModal.modal.fade.bd-example-modal-lg(tabindex="-1",role="dialog",aria-labelledby="myLargeModalLabel",aria-hidden="true")
    .modal-dialog.modal-lg 
        #videoModal.modal-content

        include ./includes/script

            script. 
                var player = null;

                $(document).ready(function(){
                
                $('#myModal').on('hidden.bs.modal',function(e){
                    if(player && player.pause)
                })

                $('.card-img-top').click(function(e){
                    var video = $(this).data('video');
                    var image = $(this).attr('src');

                    $('#myModal').modal('show')

                        if(!player){
                            player = new DPlayer({
                                container: document.getElementById('videoModal')
                                screenshot: true,
                                video:{
                                    url:video,
                                    pic: image,
                                    thumbnails: image
                                }
                            })
                        } else {
                            if(play.video.currentSrc !==video){
                                player.switchVideo({
                                        url: video,
                                        pic: image,
                                        type: 'auto'
                                })
                            }
                        }
                    })
                })
```