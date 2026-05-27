document.addEventListener('DOMContentLoaded', function () {
    const rooms = document.querySelectorAll('.room-group');
    const paths = document.querySelectorAll('.path-to-room');
    const info = document.querySelectorAll('.wrapp-info');
    const closeBtns = document.querySelectorAll('.close-btn');
    console.log(info)
    let autoCloseTimer = null;
    const AUTO_CLOSE_DELAY = 5000;

    function deactivateAll() {
        rooms.forEach(r => r.classList.remove('active'));
        paths.forEach(p => p.classList.remove('active'));
        info.forEach(i => i.classList.remove('active'));
        clearTimeout(autoCloseTimer);
    }

    function resetTimer() {
        clearTimeout(autoCloseTimer);
        const hasActive = [...rooms, ...paths].some(el => el.classList.contains('active'));
        if (hasActive) {
            autoCloseTimer = setTimeout(deactivateAll, AUTO_CLOSE_DELAY);
        }
    }

    rooms.forEach((room, index) =>{
        room.addEventListener('click', function () {
            rooms.forEach(r => {
                if (r !== this) {
                    r.classList.remove('active');
                }
            });
            paths.forEach((p, i) => {
                if (i !== index){
                    p.classList.remove('active');
                }
            })
            info.forEach((item, i) => {
                if (i !== index){
                    item.classList.remove('active');
                }
            })
            if(paths[index]){
                paths[index].classList.toggle('active');
            }
            if(info[index]){
                info[index].classList.add('active');
            }
            this.classList.toggle('active');

            resetTimer();
        });
    });

    closeBtns.forEach((btn, index) =>{
        btn.addEventListener('click', function (e) {
            info[index].classList.remove('active');
        });
    })

    document.addEventListener('click', function (e) {
        const isInsideRoom = e.target.closest('.room-group');
        const isInsidePath = e.target.closest('.path-to-room');

        if (!isInsideRoom && !isInsidePath) {
            deactivateAll();
        }
    });

    

});