export class Overlay {
  public title: string;
  public overlay: HTMLElement;
  public modal: HTMLElement;

  constructor(title: string) {
    this.title = title;
    this.modal = document.createElement("div");
    this.overlay = document.createElement("div");
    this.modal.setAttribute("class", "modal");
    this.overlay.setAttribute("id", "overlay");
  }

  public generateModal() : void {
    const modalHeader = document.createElement("div");
    const modalTitle = document.createElement("div");
    const modalClose = document.createElement("div");
    const close = document.createElement("span");

    modalHeader.setAttribute("class", "pure-g modal-header");
    modalTitle.setAttribute("class", "pure-u-1-2 modal-title");
    modalTitle.innerHTML = this.title;
    modalClose.setAttribute("class", "pure-u-1-2 modal-close");
    close.setAttribute("class", "fa fa-times");

    close.addEventListener("click", (event: Event) => {
      this.overlay.remove();
    }, false);

    modalClose.appendChild(close);
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(modalClose);
    this.modal.appendChild(modalHeader);
  }

  public generateLoader() {
    const loadingContainer = <HTMLElement>document.createElement("div");
    const spinner = <HTMLElement>document.createElement("span");
    loadingContainer.id = "loadingContainer";
    spinner.setAttribute("class", "fas fa-spinner spinner spinner-center");
    spinner.id = "loadingSpinner";
    loadingContainer.appendChild(spinner);
    this.modal.appendChild(loadingContainer);
  }

  public create(selector = "dashboard") : void {
    let body = null;
    if (selector !== "dashboard") {
      body = document.querySelector('body');
    } else {
      body = document.getElementById(selector);
    }
    // remove overlay if clicked outside of modal
    this.overlay.addEventListener("click", (event: Event) => {
      let target = <HTMLElement>event.target;
      if (target === this.overlay) {
        this.overlay.remove();
      }
    }, false);  
    
    this.overlay.style.visibility = (this.overlay.style.visibility === "visible") ? "hidden" : "visible"; 
    this.overlay.appendChild(this.modal)
    body.appendChild(this.overlay);
  }
}


}