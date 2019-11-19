(function () {
    let canvas = this._canvas = new fabric.Canvas('canvas');

    const _actionButtons = document.querySelectorAll('.btn-actions button');
    const _colors = ['red', 'blue', 'green', 'yellow'];
    let _removeBtn = null;
    let currentPage = 1;

    let getById = (id) => {
        return document.getElementById(id);
    };

    let randomColor = () => {
        return _colors[Math.floor(Math.random() * _colors.length)];
    };
    let randomInitFromRange = (max, min) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    let drawElements = (params) => {
        canvas.add(new fabric[params.type](params.data, (params.type === 'Polygon' && {fill: randomColor()})));
    };

    let ActionButtonClick = (elem) => {
        elem.onclick = function () {
            if (this.getAttribute('id') === 'remove') {
                canvas.remove(canvas.getActiveObject());
                return;
            }
            const $attrHint = this.getAttribute('data-hint');
            let drawParams = null;
            if ($attrHint === 'Rect') {
                drawParams = {
                    fill: randomColor(),
                    top: randomInitFromRange(0, (canvas.height - 100)),
                    left: randomInitFromRange(0, (canvas.width - 100)),
                    height: 100,
                    width: 100
                }
            } else if ($attrHint === 'Polygon') {
                const x = randomInitFromRange(0, (canvas.width - 100));
                const y = randomInitFromRange(0, (canvas.height - 100));
                const p1 = {left: x, top: y};
                const p2 = {left: x + 50, top: y - 50};
                const p3 = {left: x + 100, top: y};
                drawParams = [{x: p1.left, y: p1.top}, {x: p2.left, y: p2.top}, {x: p3.left, y: p3.top}];
            } else if ($attrHint === 'Circle') {
                drawParams = {
                    left: randomInitFromRange(0, (canvas.width - 100)),
                    top: randomInitFromRange(0, (canvas.height - 100)),
                    radius: 50,
                    strokeWidth: 3,
                    fill: randomColor()
                }
            }
            drawElements(
                {type: $attrHint, data: drawParams}
            );
        }
    };

    let loadCanvasDataFromJson = (data) => {
        canvas.loadFromJSON(data, function () {
            },
            function (o, object) {
            });
    };

    let getElementsFromApi = (page) => {
        $("#more-elements").remove();

        axios.get('/api/elements', {
            params: {
                page: page
            }
        })
            .then((response) => {
                if (response.data && response.data.data && response.data.data.length > 0) {
                    let liItems = '';
                    response.data.data.forEach((item, i) => {
                        let itemChecked = '';
                        if (i === 0 && page === 1) {
                            itemChecked = 'checked';
                        }
                        liItems += `<li class="list-group-item" id="li-item-${item.id}" data-item-id="${item.id}">
                                        <div class="form-check">
                                          <input class="form-check-input" type="radio" name="saved-elements" id="saved-item-${item.id}" value="${item.id}" ${itemChecked}>
                                          <label class="form-check-label" for="saved-item-${item.id}">
                                            ${item.title}
                                          </label>
                                        </div>
                                        <button class="btn btn-sm btn-danger remove-item" data-item-id="${item.id}">x</button>
                                    </li>`;
                    });
                    if (page === 1) {
                        loadCanvasDataFromJson(response.data.data[0].options); // default first item showing
                    }

                    if(response.data.links && response.data.links.next) {
                        liItems += `<li class="list-group-item text-center" id="more-elements">
                                        <button class="btn btn-sm btn-primary">More+</button>
                                    </li>`;
                    }
                    $('#show-elements').append(liItems);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    let showElementsFromApi = (id) => {
        axios.get(`/api/elements/${id}`)
            .then((response) => {
                if (response.data && response.data.data && response.data.data.options) {
                    loadCanvasDataFromJson(response.data.data.options);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    _actionButtons.forEach(btn => {
        if (btn.getAttribute('id') === 'remove') {
            _removeBtn = btn;
        }
        ActionButtonClick(btn);
    });
    canvas.on('selection:cleared', () => {
        if (_removeBtn) _removeBtn.setAttribute('disabled', true);

    });
    canvas.on('object:selected', () => {
        if (_removeBtn) _removeBtn.removeAttribute('disabled');
    });

    let saveElements = getById('save-elements');

    saveElements.onclick = () => {
        const itemId = $('input[type=radio][name=saved-elements]:checked').val();
        let jsonObj = canvas.toJSON(['id']);

        if (itemId) { // update item
            axios.put(`/api/elements/${itemId}`, {
                options: jsonObj
            })
                .then((response) => {

                })
                .catch((error) => {
                    console.log(error);
                });
        } else { // store new item
            axios.post('/api/elements', {
                options: jsonObj
            })
                .then((response) => {
                    $('#show-elements').html('');
                    currentPage = 1;
                    getElementsFromApi(currentPage); // todo default value
                })
                .catch((error) => {
                    console.log(error);
                });
        }

    };
    getElementsFromApi(currentPage);

    $(document).on('change', 'input[type=radio][name=saved-elements]', function () {
        showElementsFromApi($(this).val());
    });
    $(document).on('click', '.remove-item', function () {
        const itemId = $(this).attr('data-item-id');
        if(confirm("Are you sure?")){
            if($(`#saved-item-${itemId}`).is(':checked')) {
                const nextLi = $(this).closest('li').next();
                let needSelectItemId;
                if(nextLi.length === 0) {
                    const prevLi = $(this).closest('li').prev();
                    needSelectItemId = prevLi.attr('data-item-id');
                } else{
                    needSelectItemId = nextLi.attr('data-item-id');
                }

                showElementsFromApi(needSelectItemId);
                $('input[type=radio][name=saved-elements]:checked').prop('checked', false);
                $(`#saved-item-${needSelectItemId}`).prop('checked', true);
            }

            axios.delete(`/api/elements/${itemId}`)
                .then((response) => {
                    $('#li-item-' + itemId).remove();
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    });
    $(document).on('click', '#reset-elements', function () {
        canvas.clear();
        $('input[type=radio][name=saved-elements]:checked').prop('checked', false);
    });
    $(document).on('click', '#more-elements', function () {
       currentPage++;
       getElementsFromApi(currentPage);
    });
})();
