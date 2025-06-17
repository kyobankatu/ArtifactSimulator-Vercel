export function scanInfo(vm, open) {
  if (open) {
    vm.show_scan_info = true;
    vm.show_close_button = true;
    setTimeout(() => {
      vm.show_info_box = true;
    }, 100);
  } else {
    vm.show_info_box = false;
    setTimeout(() => {
      vm.show_close_button = false;
      vm.show_scan_info = false;
    }, 400);
  }
}

export function dataInfo(vm, open) {
  if (open) {
    vm.show_data_info = true;
    vm.show_close_button = true;
    setTimeout(() => {
      vm.show_info_box = true;
    }, 100);
  } else {
    vm.show_info_box = false;
    setTimeout(() => {
      vm.show_close_button = false;
      vm.show_data_info = false;
    }, 400);
  }
}