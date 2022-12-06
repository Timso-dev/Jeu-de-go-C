#include <stdio.h>
char tableau[10][10];
int i,j,pointsJ1,pointsJ2,stop,tour,choix;
char J1[10];
char J2[10];
char coordonnee_horizontale;
int coordonnee_verticale;
int pierreNoir=181;
int pierreBlanche=180;
int ptsNoir=0;
int ptsBlanc=0;
int mortblanc[10][10];
int mortnoir[10][10];
int liennoir[10][10];
int lienblanc[10][10];
init_tableau(){
    for (i = 0; i < 10; i++){
        for (j = 0; j < 10; j++){
            tableau[i][j]= '.';
            mortblanc[i][j]=0;
            mortnoir[i][j]=0;
        } 
    }
    tableau[0][0]= ' ';
    tableau[0][1]= 'A';
    tableau[0][2]= 'B';
    tableau[0][3]= 'C';
    tableau[0][4]= 'D';
    tableau[0][5]= 'E';
    tableau[0][6]= 'F';
    tableau[0][7]= 'G';
    tableau[0][8]= 'H';
    tableau[0][9]= 'I';

    tableau[1][0]= '1';
    tableau[2][0]= '2';
    tableau[3][0]= '3';
    tableau[4][0]= '4';
    tableau[5][0]= '5';
    tableau[6][0]= '6';
    tableau[7][0]= '7';
    tableau[8][0]= '8';
    tableau[9][0]= '9';

    mortblanc[1][1]= 1;
    mortblanc[1][2]= 1;
    mortblanc[1][3]= 1;
    mortblanc[1][4]= 1;
    mortblanc[1][5]= 1;
    mortblanc[1][6]= 1;
    mortblanc[1][7]= 1;
    mortblanc[1][8]= 1;
    mortblanc[1][9]= 1;
    mortblanc[2][9]= 1;
    mortblanc[3][9]= 1;
    mortblanc[4][9]= 1;
    mortblanc[5][9]= 1;
    mortblanc[6][9]= 1;
    mortblanc[7][9]= 1;
    mortblanc[8][9]= 1;
    mortblanc[9][9]= 1;
    mortblanc[9][8]= 1;
    mortblanc[9][7]= 1;
    mortblanc[9][6]= 1;
    mortblanc[9][5]= 1;
    mortblanc[9][4]= 1;
    mortblanc[9][3]= 1;
    mortblanc[9][2]= 1;
    mortblanc[9][1]= 1;
    mortblanc[8][1]= 1;
    mortblanc[7][1]= 1;
    mortblanc[6][1]= 1;
    mortblanc[5][1]= 1;
    mortblanc[4][1]= 1;
    mortblanc[3][1]= 1;
    mortblanc[2][1]= 1;

    mortnoir[1][1]= 1;
    mortnoir[1][2]= 1;
    mortnoir[1][3]= 1;
    mortnoir[1][4]= 1;
    mortnoir[1][5]= 1;
    mortnoir[1][6]= 1;
    mortnoir[1][7]= 1;
    mortnoir[1][8]= 1;
    mortnoir[1][9]= 1;
    mortnoir[2][9]= 1;
    mortnoir[3][9]= 1;
    mortnoir[4][9]= 1;
    mortnoir[5][9]= 1;
    mortnoir[6][9]= 1;
    mortnoir[7][9]= 1;
    mortnoir[8][9]= 1;
    mortnoir[9][9]= 1;
    mortnoir[9][8]= 1;
    mortnoir[9][7]= 1;
    mortnoir[9][6]= 1;
    mortnoir[9][5]= 1;
    mortnoir[9][4]= 1;
    mortnoir[9][3]= 1;
    mortnoir[9][2]= 1;
    mortnoir[9][1]= 1;
    mortnoir[8][1]= 1;
    mortnoir[7][1]= 1;
    mortnoir[6][1]= 1;
    mortnoir[5][1]= 1;
    mortnoir[4][1]= 1;
    mortnoir[3][1]= 1;
    mortnoir[2][1]= 1;
}
affiche_tableau(){
    /* for (i = 0; i < 10; i++){
        for (j = 0; j < 10; j++){
            printf("%d ",mortblanc[i][j]);   
        } 
        printf("\n");
    } 
    printf("\n");
    for (i = 0; i < 10; i++){
        for (j = 0; j < 10; j++){
            printf("%d ",mortnoir[i][j]);
        } 
        printf("\n");
    }
    printf("\n");*/

    printf("\n");
    for (i = 0; i < 10; i++){
        for (j = 0; j < 10; j++){
            printf("%c ",tableau[i][j]);
        } 
        printf("\n"); 
    }
    printf("\n");
}
affiche_pts(){
    printf("\n");
    printf("Voici les scores :\n");
    printf("%s = %d\n",J1,ptsNoir);
    printf("%s = %d\n",J2,ptsBlanc);
    printf("\n");
}
choix_joueur(){
    printf("Choix des couleurs des pierres et des noms des joeurs.\nLe joueur 1 prendra les pierres noires et le joueur 2 prendra les pierres blanches.\n");
    printf("Joueur 1 : ");
    scanf("%s",J1);
    printf("Joueur 2 : ");
    scanf("%s",J2);
    printf("C'est donc %s qui commencera à jouer\n\n",J1);
}
conversion(){
    if (coordonnee_horizontale=='A'){
        j=1;
    }
    else if (coordonnee_horizontale=='B'){
        j=2;
    }
    else if (coordonnee_horizontale=='C'){
        j=3;
    }
    else if (coordonnee_horizontale=='D'){
        j=4;
    }
    else if (coordonnee_horizontale=='E'){
        j=5;
    }
    else if (coordonnee_horizontale=='F'){
        j=6;
    }
    else if (coordonnee_horizontale=='G'){
        j=7;
    }
    else if (coordonnee_horizontale=='H'){
        j=8;
    }
    else if (coordonnee_horizontale=='I'){
        j=9;
    }
    else {
        printf("erreur, votre choix n'est pas connu\n");
    }
}
choix_tour_J1(){
    tour=0;
    while (tour!=1)
    {
        printf("%s, c'est à vous de jouer !\n",J1);
        printf("Il vous reste %d pierre(s) Noire\n",pierreNoir);
        printf("Voulez vous passer votre tour ? (oui : 1 / non : 0) : ");
        scanf("%d",&choix);
        if (choix==1)
        {
            stop=stop+1;
            tour=1;
        }
        else if (choix==0){
            printf("\n");
            printf("Donnez une coordonnée où placer votre pierre : \n");
            printf("Coordonnée horizontale (A-I): ");
            fflush(stdin);
            scanf("%c",&coordonnee_horizontale);
            printf("Coordonnée verticale (1-9): ");
            scanf("%d",&coordonnee_verticale);
            conversion();
            i=coordonnee_verticale;
            if ((tableau[i][j])!=('.'))
            {
                printf("erreur, la case est déjà prise\n");
            }
            else if(pierreBlanche>0)
            {
                tableau[i][j]= 'N';
                mortblanc[i-1][j]=(mortblanc[i-1][j])+1;
                mortblanc[i][j-1]=(mortblanc[i][j-1])+1;
                mortblanc[i+1][j]=(mortblanc[i+1][j])+1;
                mortblanc[i][j+1]=(mortblanc[i][j+1])+1;
                pierreNoir=pierreNoir-1;
                tour=1;
                stop=0;

            } 
            else
            {
                printf("Vous n'avez plus de pierre Noire\n");
            }  
        }
        else{
            printf("erreur, votre choix n'est pas connu\n");
        }  
    }  
}
choix_tour_J2(){
    tour=0;
    while (tour!=1)
    {
        printf("%s, c'est à vous de jouer !\n",J2);
        printf("Il vous reste %d pierre(s) Blanche\n",pierreBlanche);
        printf("Voulez vous passer votre tour ? (oui : 1 / non : 0) : ");
        scanf("%d",&choix);
        if (choix==1)
        {
            stop=stop+1;
            tour=1;
        }
        else if (choix==0){
            printf("Donnez une coordonnée où placer votre pierre : \n");
            printf("Coordonnée horizontale (A-I): ");
            fflush(stdin);
            scanf("%c",&coordonnee_horizontale);
            printf("Coordonnée verticale (1-9): ");
            scanf("%d",&coordonnee_verticale);
            conversion();
            i=coordonnee_verticale;
            if ((tableau[i][j])!=('.'))
            {
                printf("erreur, la case est déjà prise\n");
            }
            else if(pierreBlanche>0)
            {
                tableau[i][j]= 'B';
                mortnoir[i-1][j]=(mortnoir[i-1][j])+1;
                mortnoir[i][j-1]=(mortnoir[i][j-1])+1;
                mortnoir[i+1][j]=(mortnoir[i+1][j])+1;
                mortnoir[i][j+1]=(mortnoir[i][j+1])+1;

                pierreBlanche=pierreBlanche-1;
                tour=1;
                stop=0;
            } 
            else
            {
                printf("Vous n'avez plus de pierre Blanche\n");
            }    
        }
        else{
            printf("erreur, votre choix n'est pas connu\n");
        }  
    }
}
piege(){
    for (i = 0; i < 10; i++){
        for (j = 0; j < 10; j++){

            if ((mortnoir[i][j]==3)&&((mortnoir[i-1][j]==3)||(mortnoir[i+1][j]==3)||(mortnoir[i][j-1]==3)||(mortnoir[i][j+1]==3))){

                if (tableau[i+1][j]=='N'){
                    mortnoir[i+1][j]=(mortnoir[i+1][j])+1;
                }
                if (tableau[i-1][j]=='N'){
                    mortnoir[i-1][j]=(mortnoir[i-1][j])+1;
                }
                if (tableau[i][j-1]=='N'){
                    mortnoir[i][j-1]=(mortnoir[i][j-1])+1;
                }
                if (tableau[i][j+1]=='N'){
                    mortnoir[i][j+1]=(mortnoir[i][j+1])+1;
                }
            }
            else if ((mortblanc[i][j]==3)&&((mortblanc[i-1][j]==3)||(mortblanc[i+1][j]==3)||(mortblanc[i][j-1]==3)||(mortblanc[i][j+1]==3))){

                if (tableau[i+1][j]=='B'){
                    mortblanc[i+1][j]=(mortblanc[i+1][j])+1;
                }
                if (tableau[i-1][j]=='B'){
                    mortblanc[i-1][j]=(mortblanc[i-1][j])+1;
                }
                if (tableau[i][j-1]=='B'){
                    mortblanc[i][j-1]=(mortblanc[i][j-1])+1;
                }
                if (tableau[i][j+1]=='B'){
                    mortblanc[i][j+1]=(mortblanc[i][j+1])+1;
                }
            }
        }
    }
    for (i = 0; i < 10; i++){
        for (j = 0; j < 10; j++){
            if ((mortnoir[i][j]==4)&&(tableau[i][j]=='N')){
            tableau[i][j]= '.';
            ptsBlanc =ptsBlanc+2;
          }
          else if ((mortblanc[i][j]==4)&&(tableau[i][j]=='B')){
            tableau[i][j]= '.';
            ptsNoir=ptsNoir+2;
          }
        } 
    }
}
int main() {
    init_tableau();
    affiche_tableau();
    choix_joueur();
    stop=0;
    while (stop!=2){
        choix_tour_J1();
        piege();
        affiche_tableau();
        affiche_pts();
        if (stop!=2){
            choix_tour_J2();
            piege();
            affiche_tableau();
            affiche_pts();
        }
    }
    if (ptsNoir>ptsBlanc){
        printf("FELICITATION %s, VOUS AVEZ GAGNEZ !\n",J1);
    }
    else if (ptsNoir<ptsBlanc){
        printf("FELICITATION %s, VOUS AVEZ GAGNEZ !\n",J2);
    }
    else if (ptsNoir=ptsBlanc){
        printf("C'EST UN MATCH NULL FELICITATION A VOUS DEUX %s et %s!\n",J1,J2);
    }
   return 0;  
}