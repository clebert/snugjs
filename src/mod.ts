export * from './children.js';
export * from './custom-element.js';
export * from './fragment.js';
export * from './h.js';
export * from './permanent-store.js';
export * from './props.js';
export * from './race.js';
export * from './store.js';
export * from './subject.js';

declare global {
  namespace JSX {
    type Element = HTMLElement | DocumentFragment | string;
    type ElementChild = Element | number | false | undefined | null;

    interface ElementChildrenAttribute {
      children?: ElementChild | ElementChild[];
    }

    interface IntrinsicElement extends ElementChildrenAttribute {
      /** Keyboard shortcut to activate or focus element */
      accesskey?: string;
      /** Recommended autocapitalization behavior (for supported input methods) */
      autocapitalize?:
        | 'on'
        | 'off'
        | 'none'
        | 'sentences'
        | 'words'
        | 'characters';
      /** Automatically focus the element when the page is loaded */
      autofocus?: boolean;
      /** Classes to which the element belongs */
      class?: string;
      /** Whether the element is editable */
      contenteditable?: 'true' | 'false';
      /** The text directionality of the element */
      dir?: 'ltr' | 'rtl' | 'auto';
      /** Whether the element is draggable */
      draggable?: 'true' | 'false';
      /** Hint for selecting an enter key action */
      enterkeyhint?:
        | 'enter'
        | 'done'
        | 'go'
        | 'next'
        | 'previous'
        | 'search'
        | 'send';
      /** Whether the element is relevant */
      hidden?: boolean;
      /** The element's ID */
      id?: string;
      /** Whether the element is inert. */
      inert?: boolean;
      /** Hint for selecting an input modality */
      inputmode?:
        | 'none'
        | 'text'
        | 'tel'
        | 'email'
        | 'url'
        | 'numeric'
        | 'decimal'
        | 'search';
      /** Creates a customized built-in element */
      is?: string;
      /** Global identifier for a microdata item */
      itemid?: string;
      /** Property names of a microdata item */
      itemprop?: string;
      /** Referenced elements */
      itemref?: string;
      /** Introduces a microdata item */
      itemscope?: boolean;
      /** Item types of a microdata item */
      itemtype?: string;
      /** Language of the element */
      lang?: string;
      /** Cryptographic nonce used in Content Security Policy checks [CSP] */
      nonce?: string;
      /** Affects willValidate, plus any behavior added by the custom element author */
      readonly?: boolean;
      /** The element's desired slot */
      slot?: string;
      /** Whether the element is to have its spelling and grammar checked */
      spellcheck?: 'true' | 'false';
      /** Presentational and formatting instructions */
      style?: string;
      /** Whether the element is focusable and sequentially focusable, and the relative order of the element for the purposes of sequential focus navigation */
      tabindex?: number;
      /** Advisory information for the element */
      title?: string;
      /** Whether the element is to be translated when the page is localized */
      translate?: 'yes' | 'no';
    }

    interface IntrinsicElements {
      a: IntrinsicElement & {
        /** Whether to download the resource instead of navigating to it, and its filename if so */
        download?: string;
        /** Address of the hyperlink */
        href?: string;
        /** Language of the linked resource */
        hreflang?: string;
        /** URLs to ping */
        ping?: string;
        /** Referrer policy for fetches initiated by the element */
        referrerpolicy?: string;
        /** Relationship between the location in the document containing the hyperlink and the destination resource */
        rel?: string;
        /** Browsing context for hyperlink navigation */
        target?: string;
        /** Hint for the type of the referenced resource */
        type?: string;
      };
      abbr: IntrinsicElement & {
        /** Full term or expansion of abbreviation */
        title?: string;
      };
      address: IntrinsicElement & {};
      area: IntrinsicElement & {
        /** Replacement text for use when images are not available */
        alt?: string;
        /** Coordinates for the shape to be created in an image map */
        coords?: string;
        /** Whether to download the resource instead of navigating to it, and its filename if so */
        download?: string;
        /** Address of the hyperlink */
        href?: string;
        /** URLs to ping */
        ping?: string;
        /** Referrer policy for fetches initiated by the element */
        referrerpolicy?: string;
        /** Relationship between the location in the document containing the hyperlink and the destination resource */
        rel?: string;
        /** The kind of shape to be created in an image map */
        shape?: 'circle' | 'default' | 'poly' | 'rect';
        /** Browsing context for hyperlink navigation */
        target?: string;
      };
      article: IntrinsicElement & {};
      aside: IntrinsicElement & {};
      audio: IntrinsicElement & {
        /** Hint that the media resource can be started automatically when the page is loaded */
        autoplay?: boolean;
        /** Show user agent controls */
        controls?: boolean;
        /** How the element handles crossorigin requests */
        crossorigin?: 'anonymous' | 'use-credentials';
        /** Whether to loop the media resource */
        loop?: boolean;
        /** Whether to mute the media resource by default */
        muted?: boolean;
        /** Hints how much buffering the media resource will likely need */
        preload?: 'none' | 'metadata' | 'auto';
        /** Address of the resource */
        src?: string;
      };
      b: IntrinsicElement & {};
      base: IntrinsicElement & {
        /** Document base URL */
        href?: string;
        /** Default browsing context for hyperlink navigation and form submission */
        target?: string;
      };
      bdi: IntrinsicElement & {};
      bdo: IntrinsicElement & {
        /** The text directionality of the element */
        dir?: 'ltr' | 'rtl';
      };
      blockquote: IntrinsicElement & {
        /** Link to the source of the quotation or more information about the edit */
        cite?: string;
      };
      body: IntrinsicElement & {};
      br: IntrinsicElement & {};
      button: IntrinsicElement & {
        /** Whether the form control is disabled */
        disabled?: boolean;
        /** Associates the element with a form element */
        form?: string;
        /** URL to use for form submission */
        formaction?: string;
        /** Entry list encoding type to use for form submission */
        formenctype?:
          | 'application/x-www-form-urlencoded'
          | 'multipart/form-data'
          | 'text/plain';
        /** Variant to use for form submission */
        formmethod?: 'GET' | 'POST' | 'dialog';
        /** Bypass form control validation for form submission */
        formnovalidate?: boolean;
        /** Browsing context for form submission */
        formtarget?: string;
        /** Name of the element to use for form submission and in the form.elements API */
        name?: string;
        /** Type of button */
        type?: 'submit' | 'reset' | 'button';
        /** Value to be used for form submission */
        value?: string;
      };
      canvas: IntrinsicElement & {
        /** Vertical dimension */
        height?: number;
        /** Horizontal dimension */
        width?: number;
      };
      caption: IntrinsicElement & {};
      cite: IntrinsicElement & {};
      code: IntrinsicElement & {};
      col: IntrinsicElement & {
        /** Number of columns spanned by the element */
        span?: number;
      };
      colgroup: IntrinsicElement & {
        /** Number of columns spanned by the element */
        span?: number;
      };
      data: IntrinsicElement & {
        /** Machine-readable value */
        value?: string;
      };
      datalist: IntrinsicElement & {};
      dd: IntrinsicElement & {};
      del: IntrinsicElement & {
        /** Link to the source of the quotation or more information about the edit */
        cite?: string;
        /** Date and (optionally) time of the change */
        datetime?: string;
      };
      details: IntrinsicElement & {
        /** Whether the details are visible */
        open?: boolean;
      };
      dfn: IntrinsicElement & {
        /** Full term or expansion of abbreviation */
        title?: string;
      };
      dialog: IntrinsicElement & {
        /** Whether the dialog box is showing */
        open?: boolean;
      };
      div: IntrinsicElement & {};
      dl: IntrinsicElement & {};
      dt: IntrinsicElement & {};
      em: IntrinsicElement & {};
      embed: IntrinsicElement & {
        /** Vertical dimension */
        height?: number;
        /** Address of the resource */
        src?: string;
        /** Type of embedded resource */
        type?: string;
        /** Horizontal dimension */
        width?: number;
      };
      fieldset: IntrinsicElement & {
        /** Whether the descendant form controls, except any inside legend, are disabled */
        disabled?: boolean;
        /** Associates the element with a form element */
        form?: string;
        /** Name of the element to use for form submission and in the form.elements API */
        name?: string;
      };
      figcaption: IntrinsicElement & {};
      figure: IntrinsicElement & {};
      footer: IntrinsicElement & {};
      form: IntrinsicElement & {
        /** Character encodings to use for form submission */
        'accept-charset'?: string;
        /** URL to use for form submission */
        'action'?: string;
        /** Default setting for autofill feature for controls in the form */
        'autocomplete'?: 'on' | 'off';
        /** Entry list encoding type to use for form submission */
        'enctype'?:
          | 'application/x-www-form-urlencoded'
          | 'multipart/form-data'
          | 'text/plain';
        /** Variant to use for form submission */
        'method'?: 'GET' | 'POST' | 'dialog';
        /** Name of form to use in the document.forms API */
        'name'?: string;
        /** Bypass form control validation for form submission */
        'novalidate'?: boolean;
        /** Browsing context for form submission */
        'target'?: string;
      };
      h1: IntrinsicElement & {};
      h2: IntrinsicElement & {};
      h3: IntrinsicElement & {};
      h4: IntrinsicElement & {};
      h5: IntrinsicElement & {};
      h6: IntrinsicElement & {};
      head: IntrinsicElement & {};
      header: IntrinsicElement & {};
      hgroup: IntrinsicElement & {};
      hr: IntrinsicElement & {};
      html: IntrinsicElement & {};
      i: IntrinsicElement & {};
      iframe: IntrinsicElement & {
        /** Permissions policy to be applied to the iframe's contents */
        allow?: string;
        /** Whether to allow the iframe's contents to use requestFullscreen() */
        allowfullscreen?: boolean;
        /** Vertical dimension */
        height?: number;
        /** Used when determining loading deferral */
        loading?: 'lazy' | 'eager';
        /** Name of nested browsing context */
        name?: string;
        /** Referrer policy for fetches initiated by the element */
        referrerpolicy?: string;
        /** Security rules for nested content */
        sandbox?: string;
        /** Address of the resource */
        src?: string;
        /** A document to render in the iframe */
        srcdoc?: string;
        /** Horizontal dimension */
        width?: number;
      };
      img: IntrinsicElement & {
        /** Replacement text for use when images are not available */
        alt?: string;
        /** How the element handles crossorigin requests */
        crossorigin?: 'anonymous' | 'use-credentials';
        /** Decoding hint to use when processing this image for presentation */
        decoding?: 'sync' | 'async' | 'auto';
        /** Vertical dimension */
        height?: number;
        /** Whether the image is a server-side image map */
        ismap?: boolean;
        /** Used when determining loading deferral */
        loading?: 'lazy' | 'eager';
        /** Referrer policy for fetches initiated by the element */
        referrerpolicy?: string;
        /** Image sizes for different page layouts */
        sizes?: string;
        /** Address of the resource */
        src?: string;
        /** Images to use in different situations, e.g., high-resolution displays, small monitors, etc. */
        srcset?: string;
        /** Name of image map to use */
        usemap?: string;
        /** Horizontal dimension */
        width?: number;
      };
      input: IntrinsicElement & {
        /** Hint for expected file type in file upload controls */
        accept?: string;
        /** Replacement text for use when images are not available */
        alt?: string;
        /** Hint for form autofill feature */
        autocomplete?: string;
        /** Whether the control is checked */
        checked?: boolean;
        /** Name of form control to use for sending the element's directionality in form submission */
        dirname?: string;
        /** Whether the form control is disabled */
        disabled?: boolean;
        /** Associates the element with a form element */
        form?: string;
        /** URL to use for form submission */
        formaction?: string;
        /** Entry list encoding type to use for form submission */
        formenctype?:
          | 'application/x-www-form-urlencoded'
          | 'multipart/form-data'
          | 'text/plain';
        /** Variant to use for form submission */
        formmethod?: 'GET' | 'POST' | 'dialog';
        /** Bypass form control validation for form submission */
        formnovalidate?: boolean;
        /** Browsing context for form submission */
        formtarget?: string;
        /** Vertical dimension */
        height?: number;
        /** List of autocomplete options */
        list?: string;
        /** Maximum value */
        max?: string;
        /** Maximum length of value */
        maxlength?: number;
        /** Minimum value */
        min?: string;
        /** Minimum length of value */
        minlength?: number;
        /** Whether to allow multiple values */
        multiple?: boolean;
        /** Name of the element to use for form submission and in the form.elements API */
        name?: string;
        /** Pattern to be matched by the form control's value */
        pattern?: string;
        /** User-visible label to be placed within the form control */
        placeholder?: string;
        /** Whether to allow the value to be edited by the user */
        readonly?: boolean;
        /** Whether the control is required for form submission */
        required?: boolean;
        /** Size of the control */
        size?: number;
        /** Address of the resource */
        src?: string;
        /** Granularity to be matched by the form control's value */
        step?: number | 'any';
        /** Description of pattern (when used with pattern attribute) */
        title?: string;
        /** Type of form control */
        type?: string;
        /** Value of the form control */
        value?: string;
        /** Horizontal dimension */
        width?: number;
      };
      ins: IntrinsicElement & {
        /** Link to the source of the quotation or more information about the edit */
        cite?: string;
        /** Date and (optionally) time of the change */
        datetime?: string;
      };
      kbd: IntrinsicElement & {};
      label: IntrinsicElement & {
        /** Associate the label with form control */
        for?: string;
      };
      legend: IntrinsicElement & {};
      li: IntrinsicElement & {
        /** Ordinal value of the list item */
        value?: number;
      };
      link: IntrinsicElement & {
        /** Potential destination for a preload request (for rel="preload" and rel="modulepreload") */
        as?: string;
        /** Whether the element is potentially render-blocking */
        blocking?: string;
        /** Color to use when customizing a site's icon (for rel="mask-icon") */
        color?: string;
        /** How the element handles crossorigin requests */
        crossorigin?: 'anonymous' | 'use-credentials';
        /** Whether the link is disabled */
        disabled?: boolean;
        /** Address of the hyperlink */
        href?: string;
        /** Language of the linked resource */
        hreflang?: string;
        /** Image sizes for different page layouts (for rel="preload") */
        imagesizes?: string;
        /** Images to use in different situations, e.g., high-resolution displays, small monitors, etc. (for rel="preload") */
        imagesrcset?: string;
        /** Integrity metadata used in Subresource Integrity checks [SRI] */
        integrity?: string;
        /** Applicable media */
        media?: string;
        /** Referrer policy for fetches initiated by the element */
        referrerpolicy?: string;
        /** Relationship between the document containing the hyperlink and the destination resource */
        rel?: string;
        /** Sizes of the icons (for rel="icon") */
        sizes?: string;
        /** CSS style sheet set name */
        title?: string;
        /** Hint for the type of the referenced resource */
        type?: string;
      };
      main: IntrinsicElement & {};
      map: IntrinsicElement & {
        /** Name of image map to reference from the usemap attribute */
        name?: string;
      };
      mark: IntrinsicElement & {};
      menu: IntrinsicElement & {};
      meta: IntrinsicElement & {
        /** Character encoding declaration */
        'charset'?: 'utf-8';
        /** Value of the element */
        'content'?: string;
        /** Pragma directive */
        'http-equiv'?:
          | 'content-type'
          | 'default-style'
          | 'refresh'
          | 'x-ua-compatible'
          | 'content-security-policy';
        /** Applicable media */
        'media'?: string;
        /** Metadata name */
        'name'?: string;
      };
      meter: IntrinsicElement & {
        /** Low limit of high range */
        high?: number;
        /** High limit of low range */
        low?: number;
        /** Upper bound of range */
        max?: number;
        /** Lower bound of range */
        min?: number;
        /** Optimum value in gauge */
        optimum?: number;
        /** Current value of the element */
        value?: number;
      };
      nav: IntrinsicElement & {};
      noscript: IntrinsicElement & {};
      object: IntrinsicElement & {
        /** Address of the resource */
        data?: string;
        /** Associates the element with a form element */
        form?: string;
        /** Vertical dimension */
        height?: number;
        /** Name of nested browsing context */
        name?: string;
        /** Type of embedded resource */
        type?: string;
        /** Horizontal dimension */
        width?: number;
      };
      ol: IntrinsicElement & {
        /** Number the list backwards */
        reversed?: boolean;
        /** Starting value of the list */
        start?: number;
        /** Kind of list marker */
        type?: '1' | 'a' | 'A' | 'i' | 'I';
      };
      optgroup: IntrinsicElement & {
        /** Whether the form control is disabled */
        disabled?: boolean;
        /** User-visible label */
        label?: string;
      };
      option: IntrinsicElement & {
        /** Whether the form control is disabled */
        disabled?: boolean;
        /** User-visible label */
        label?: string;
        /** Whether the option is selected by default */
        selected?: boolean;
        /** Value to be used for form submission */
        value?: string;
      };
      output: IntrinsicElement & {
        /** Specifies controls from which the output was calculated */
        for?: string;
        /** Associates the element with a form element */
        form?: string;
        /** Name of the element to use for form submission and in the form.elements API */
        name?: string;
      };
      p: IntrinsicElement & {};
      picture: IntrinsicElement & {};
      pre: IntrinsicElement & {};
      progress: IntrinsicElement & {
        /** Upper bound of range */
        max?: number;
        /** Current value of the element */
        value?: number;
      };
      q: IntrinsicElement & {
        /** Link to the source of the quotation or more information about the edit */
        cite?: string;
      };
      rp: IntrinsicElement & {};
      rt: IntrinsicElement & {};
      ruby: IntrinsicElement & {};
      s: IntrinsicElement & {};
      samp: IntrinsicElement & {};
      script: IntrinsicElement & {
        /** Execute script when available, without blocking while fetching */
        async?: boolean;
        /** Whether the element is potentially render-blocking */
        blocking?: string;
        /** How the element handles crossorigin requests */
        crossorigin?: 'anonymous' | 'use-credentials';
        /** Defer script execution */
        defer?: boolean;
        /** Integrity metadata used in Subresource Integrity checks [SRI] */
        integrity?: string;
        /** Prevents execution in user agents that support module scripts */
        nomodule?: boolean;
        /** Referrer policy for fetches initiated by the element */
        referrerpolicy?: string;
        /** Address of the resource */
        src?: string;
        /** Type of script */
        type?: string;
      };
      section: IntrinsicElement & {};
      select: IntrinsicElement & {
        /** Hint for form autofill feature */
        autocomplete?: string;
        /** Whether the form control is disabled */
        disabled?: boolean;
        /** Associates the element with a form element */
        form?: string;
        /** Whether to allow multiple values */
        multiple?: boolean;
        /** Name of the element to use for form submission and in the form.elements API */
        name?: string;
        /** Whether the control is required for form submission */
        required?: boolean;
        /** Size of the control */
        size?: number;
      };
      slot: IntrinsicElement & {
        /** Name of shadow tree slot */
        name?: string;
      };
      small: IntrinsicElement & {};
      source: IntrinsicElement & {
        /** Vertical dimension */
        height?: number;
        /** Applicable media */
        media?: string;
        /** Image sizes for different page layouts */
        sizes?: string;
        /** Address of the resource */
        src?: string;
        /** Images to use in different situations, e.g., high-resolution displays, small monitors, etc. */
        srcset?: string;
        /** Type of embedded resource */
        type?: string;
        /** Horizontal dimension */
        width?: number;
      };
      span: IntrinsicElement & {};
      strong: IntrinsicElement & {};
      style: IntrinsicElement & {
        /** Whether the element is potentially render-blocking */
        blocking?: string;
        /** Applicable media */
        media?: string;
        /** CSS style sheet set name */
        title?: string;
      };
      sub: IntrinsicElement & {};
      summary: IntrinsicElement & {};
      sup: IntrinsicElement & {};
      table: IntrinsicElement & {};
      tbody: IntrinsicElement & {};
      td: IntrinsicElement & {
        /** Number of columns that the cell is to span */
        colspan?: number;
        /** The header cells for this cell */
        headers?: string;
        /** Number of rows that the cell is to span */
        rowspan?: number;
      };
      template: IntrinsicElement & {};
      textarea: IntrinsicElement & {
        /** Hint for form autofill feature */
        autocomplete?: string;
        /** Maximum number of characters per line */
        cols?: number;
        /** Name of form control to use for sending the element's directionality in form submission */
        dirname?: string;
        /** Whether the form control is disabled */
        disabled?: boolean;
        /** Associates the element with a form element */
        form?: string;
        /** Maximum length of value */
        maxlength?: number;
        /** Minimum length of value */
        minlength?: number;
        /** Name of the element to use for form submission and in the form.elements API */
        name?: string;
        /** User-visible label to be placed within the form control */
        placeholder?: string;
        /** Whether to allow the value to be edited by the user */
        readonly?: boolean;
        /** Whether the control is required for form submission */
        required?: boolean;
        /** Number of lines to show */
        rows?: number;
        /** How the value of the form control is to be wrapped for form submission */
        wrap?: 'soft' | 'hard';
      };
      tfoot: IntrinsicElement & {};
      th: IntrinsicElement & {
        /** Alternative label to use for the header cell when referencing the cell in other contexts */
        abbr?: string;
        /** Number of columns that the cell is to span */
        colspan?: number;
        /** The header cells for this cell */
        headers?: string;
        /** Number of rows that the cell is to span */
        rowspan?: number;
        /** Specifies which cells the header cell applies to */
        scope?: 'row' | 'col' | 'rowgroup' | 'colgroup';
      };
      thead: IntrinsicElement & {};
      time: IntrinsicElement & {
        /** Machine-readable value */
        datetime?: string | number;
      };
      title: IntrinsicElement & {};
      tr: IntrinsicElement & {};
      track: IntrinsicElement & {
        /** Enable the track if no other text track is more suitable */
        default?: boolean;
        /** The type of text track */
        kind?:
          | 'subtitles'
          | 'captions'
          | 'descriptions'
          | 'chapters'
          | 'metadata';
        /** User-visible label */
        label?: string;
        /** Address of the resource */
        src?: string;
        /** Language of the text track */
        srclang?: string;
      };
      u: IntrinsicElement & {};
      ul: IntrinsicElement & {};
      var: IntrinsicElement & {};
      video: IntrinsicElement & {
        /** Hint that the media resource can be started automatically when the page is loaded */
        autoplay?: boolean;
        /** Show user agent controls */
        controls?: boolean;
        /** How the element handles crossorigin requests */
        crossorigin?: 'anonymous' | 'use-credentials';
        /** Vertical dimension */
        height?: number;
        /** Whether to loop the media resource */
        loop?: boolean;
        /** Whether to mute the media resource by default */
        muted?: boolean;
        /** Encourage the user agent to display video content within the element's playback area */
        playsinline?: boolean;
        /** Poster frame to show prior to video playback */
        poster?: string;
        /** Hints how much buffering the media resource will likely need */
        preload?: 'none' | 'metadata' | 'auto';
        /** Address of the resource */
        src?: string;
        /** Horizontal dimension */
        width?: number;
      };
      wbr: IntrinsicElement & {};
    }
  }
}
